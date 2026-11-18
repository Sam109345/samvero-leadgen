import { NextRequest, NextResponse } from 'next/server';
import { Lead } from '@/types';
import { getPortalUserById, getLeadAssignedUser } from '@/lib/user-store';
import { getSubscriptionById } from '@/lib/saas-store';
import { getEffectiveUser } from '@/lib/auth-user';
import { getAllUserLeadStates, computeLeadWorkspaceStats } from '@/lib/lead-workspace-store';
import { loadAllStoredLeads, persistDiscoveredLeads, deleteStoredLead, updateStoredLead, extractCanonicalDomain, normalizeEmailKey, normalizePhoneKey } from '@/lib/leads-persistent-store';
import { executeCentralLeadPipeline } from '@/lib/pipeline/central-lead-pipeline';
import { getMasterRealTimeLiveLeads } from '@/lib/live-lead-aggregator';
import { calculateExplainableLeadScore } from '@/lib/explainable-scoring';
import { matchesCountry } from '@/lib/country-matcher';
import { ingestContinuousFreshLeads } from '@/lib/lead-stream';

export const dynamic = 'force-dynamic';

let lastLiveFetchAt = 0;
let lastContinuousIngestAt = 0;
const LIVE_SYNC_INTERVAL_MS = 30 * 1000; // 30s auto-refresh interval for live external APIs

export async function GET(request: NextRequest) {
  // Helper to shuffle array in-place (Fisher‑Yates)
  const shuffle = <T>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  try {
    const effectiveUser = getEffectiveUser(request);
    const userStates = getAllUserLeadStates(effectiveUser.userId);

    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'all';
    const city = searchParams.get('city') || '';
    const category = searchParams.get('category') || 'all';
    const businessAge = searchParams.get('businessAge') || 'all';
    const platform = searchParams.get('platform') || 'all';
    const type = searchParams.get('type') || 'all';
    const query = searchParams.get('q') || '';
    const hasWebsite = searchParams.get('hasWebsite') || 'all';
    const statusParam = searchParams.get('status');
    const requestedUserId = searchParams.get('userId') || request.cookies.get('samvero_user_id')?.value;
    const requestedScope = searchParams.get('scope');

    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const full = searchParams.get('full') === 'true';

    // Parse pagination: default 50 leads per page, max 250 unless unpaginated is explicitly requested
    const isAllRequested = limitParam === 'all' || requestedScope === 'all-unpaginated';
    const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);
    const limit = isAllRequested ? 0 : Math.min(250, Math.max(1, parseInt(limitParam || '50', 10) || 50));

    const refresh = searchParams.get('refresh');
    const forceRefresh = refresh === 'live';

    let allLeads: Lead[] = shuffle(loadAllStoredLeads()); // randomize order each request
  // prioritize brand‑new leads for UI badge ordering
  allLeads.sort((a, b) => Number(b.isBrandNew ?? false) - Number(a.isBrandNew ?? false));

    const idParam = searchParams.get('id');
    if (idParam) {
      const singleLead = allLeads.find((l) => l.id?.toLowerCase() === idParam.toLowerCase());
      if (singleLead) {
        return NextResponse.json({ success: true, lead: singleLead, leads: [singleLead], total: 1 });
      }
      return NextResponse.json({ success: false, error: 'Lead not found', leads: [], total: 0 }, { status: 404 });
    }

    const isFilteredSearch = (country !== 'all') || (category !== 'all') || (city && city.length > 0) || (query && query.length > 0);
    const matchingCount = allLeads.filter((l) => {
      if (country !== 'all' && !matchesCountry(l.country, l.city, l.address, country, l.contact?.phone)) return false;
      if (city && !l.city?.toLowerCase().includes(city.toLowerCase())) return false;
      if (category !== 'all' && !l.category?.toLowerCase().includes(category.toLowerCase())) return false;
      if (query) {
        const q = query.toLowerCase();
        const matchesQ = l.businessName?.toLowerCase().includes(q) || l.title?.toLowerCase().includes(q) || l.category?.toLowerCase().includes(q);
        if (!matchesQ) return false;
      }
      return true;
    }).length;

    // Continuous Live Ingestion Engine:
    // When stream=true, refresh=live, or if more than 10s have elapsed since last ingestion,
    // inject a fresh high-value verified opportunity into the persistent store so newly arriving leads stream in 24/7.
    const isStreamParam = searchParams.get('stream') === 'true';
    const nowTimestamp = Date.now();
    const shouldIngestFreshStream = isStreamParam || forceRefresh || (nowTimestamp - lastContinuousIngestAt > 10000);

    if (shouldIngestFreshStream) {
      lastContinuousIngestAt = nowTimestamp;
      try {
        const newlyGenerated = ingestContinuousFreshLeads(
          1,
          platform !== 'all' ? platform : undefined,
          country !== 'all' ? country : undefined
        );
        allLeads = loadAllStoredLeads();
      } catch (ingestErr) {
        console.warn('Continuous lead streaming ingestion warning:', ingestErr);
      }
    }

    // If store is low on records or user explicitly requested live synchronization:
    // execute live central pipeline across active online APIs safely without hanging the user request
    const hasJobLeads = allLeads.some((l) => l.type === 'job' || l.platform === 'Freelancer.com' || l.platform === 'Remote OK' || l.platform === 'Remotive' || l.platform === 'Reddit');
    const isStoreEmpty = allLeads.length < 20 || !hasJobLeads;
    const isExplicitSync = forceRefresh && searchParams.get('sync') === 'live';

    if (isStoreEmpty || isExplicitSync) {
      lastLiveFetchAt = Date.now();
      try {
        const livePromise = Promise.allSettled([
          getMasterRealTimeLiveLeads({
            query: query || undefined,
            country: country !== 'all' ? country : undefined,
            city: city || undefined,
            category: category !== 'all' ? category : undefined,
            forceRefresh: true,
          }),
          executeCentralLeadPipeline({
            query: query || undefined,
            country: country !== 'all' ? country : undefined,
            city: city || undefined,
            category: category !== 'all' ? category : undefined,
            limit: 15,
            autoPersist: true,
          }),
        ]);

        // Max 3.5s timeout guard to prevent Vercel 504 serverless timeouts
        await Promise.race([
          livePromise,
          new Promise((resolve) => setTimeout(resolve, 3500)),
        ]);
        allLeads = loadAllStoredLeads();
      } catch (err) {
        console.warn('Pipeline discovery during lead fetch encounter:', err);
      }
    } else if (forceRefresh) {
      // Fire-and-forget background sync: never block HTTP response
      const timeSinceLastFetch = Date.now() - lastLiveFetchAt;
      if (timeSinceLastFetch > 60 * 1000) {
        lastLiveFetchAt = Date.now();
        Promise.allSettled([
          getMasterRealTimeLiveLeads({
            query: query || undefined,
            country: country !== 'all' ? country : undefined,
            city: city || undefined,
            category: category !== 'all' ? category : undefined,
            forceRefresh: true,
          }),
          executeCentralLeadPipeline({
            query: query || undefined,
            country: country !== 'all' ? country : undefined,
            city: city || undefined,
            category: category !== 'all' ? category : undefined,
            limit: 15,
            autoPersist: true,
          }),
        ]).catch((err) => console.warn('Background sync warning:', err));
      }
    }

    // Prioritize newest and brand-new incoming leads
    allLeads.sort((a, b) => {
      if (b.isBrandNew && !a.isBrandNew) return 1;
      if (!b.isBrandNew && a.isBrandNew) return -1;
      return (b.incomingAt ?? 0) - (a.incomingAt ?? 0);
    });
    allLeads = allLeads.map((lead) => {
      const assignedUser = getLeadAssignedUser(lead.id) || (lead.assignedToUserId ? getPortalUserById(lead.assignedToUserId) : undefined);
      const uState = userStates[lead.id];
      const currentStatus = uState?.status || 'New Lead';
      return {
        ...lead,
        currentStatus,
        approachedAt: uState?.approachedAt,
        lastContactDate: uState?.lastContactDate,
        nextFollowupDate: uState?.nextFollowupDate,
        assignedToUserId: assignedUser?.id || lead.assignedToUserId || undefined,
        assignedToUserName: assignedUser?.name || lead.assignedToUserName || undefined,
      };
    });

    // Optional status filter
    if (statusParam === 'new') {
      allLeads = allLeads.filter((l: any) => l.currentStatus === 'New Lead');
    } else if (statusParam && statusParam !== 'all') {
      allLeads = allLeads.filter((l: any) => l.currentStatus === statusParam);
    }

    // Role & Subscription check
    const portalRole = request.cookies.get('samvero_portal_role')?.value;
    const isGlobalCookie = request.cookies.get('samvero_is_global')?.value === 'true';

    if (portalRole === 'customer') {
      const customerId = requestedUserId || 'user-client-101';
      const sub = getSubscriptionById(customerId);

      if (sub) {
        const nowTime = Date.now();
        const expiryTime = new Date(sub.expiryDate).getTime();
        if (sub.status === 'expired' || expiryTime <= nowTime) {
          return NextResponse.json(
            {
              success: false,
              error: 'Your subscription has expired. Please renew to continue.',
              isExpired: true,
              leads: [],
              total: 0,
            },
            { status: 403 }
          );
        }

        if (sub.leadsConsumed >= sub.leadQuota) {
          return NextResponse.json(
            {
              success: false,
              error: `You have reached your maximum lead allocation limit of ${sub.leadQuota} leads.`,
              quotaExceeded: true,
              leads: [],
              total: 0,
            },
            { status: 403 }
          );
        }
      }
    }

    const activeUser = requestedUserId ? getPortalUserById(requestedUserId) : undefined;
    const isCustomer = portalRole === 'customer' || (activeUser && (activeUser.role as string) === 'customer') || requestedUserId === 'user-client-101';
    const isSuperAdminOrGlobal =
      isCustomer ||
      requestedScope === 'all' ||
      !activeUser ||
      activeUser.isGlobalUser ||
      activeUser.role === 'admin' ||
      activeUser.role === 'global_user' ||
      portalRole === 'admin' ||
      isGlobalCookie;

    if (!isCustomer && !isSuperAdminOrGlobal && activeUser && activeUser.role === 'staff') {
      allLeads = allLeads.filter((l) => l.assignedToUserId === activeUser.id);
    }

    // Apply country filter
    if (country !== 'all') {
      allLeads = allLeads.filter((l) => matchesCountry(l.country, l.city, l.address, country, l.contact?.phone));
    }

    // Apply city filter
    if (city && city.trim().length > 0) {
      const cLower = city.trim().toLowerCase();
      allLeads = allLeads.filter((l) => l.city?.toLowerCase().includes(cLower) || l.address?.toLowerCase().includes(cLower));
    }

    // Apply category filter
    if (category !== 'all') {
      allLeads = allLeads.filter((l) => l.category?.toLowerCase().includes(category.toLowerCase()));
    }

    // Apply platform filter (with intelligent alias handling)
    if (platform !== 'all') {
      const pFilter = platform.toLowerCase().trim();
      allLeads = allLeads.filter((l) => {
        const leadPlat = (l.platform || '').toLowerCase().trim();
        const isGmbMatch =
          (pFilter.includes('google') || pFilter.includes('gmb') || pFilter.includes('maps')) &&
          (leadPlat.includes('google') || leadPlat.includes('gmb') || leadPlat.includes('maps') || l.type === 'gmb');
        const isFreelancerMatch = pFilter.includes('freelancer') && leadPlat.includes('freelancer');
        const isLinkedInMatch = pFilter.includes('linkedin') && leadPlat.includes('linkedin');
        const isApolloMatch = pFilter.includes('apollo') && leadPlat.includes('apollo');
        const isRozeeMatch = pFilter.includes('rozee') && leadPlat.includes('rozee');
        const isExactOrSub = leadPlat.includes(pFilter) || pFilter.includes(leadPlat);
        return isGmbMatch || isFreelancerMatch || isLinkedInMatch || isApolloMatch || isRozeeMatch || isExactOrSub;
      });
    }

    // Apply type filter
    if (type === 'gmb') {
      allLeads = allLeads.filter((l) => l.type === 'gmb');
    } else if (type === 'job') {
      allLeads = allLeads.filter((l) => l.type === 'job');
    }

    // Apply business age filter
    if (businessAge !== 'all') {
      if (businessAge === 'new') {
        allLeads = allLeads.filter((l) => l.businessAge?.isNew);
      } else if (businessAge === '1-3') {
        allLeads = allLeads.filter((l) => (l.businessAge?.years ?? 0) >= 1 && (l.businessAge?.years ?? 0) <= 3);
      } else if (businessAge === '3-5') {
        allLeads = allLeads.filter((l) => (l.businessAge?.years ?? 0) > 3 && (l.businessAge?.years ?? 0) <= 5);
      } else if (businessAge === '5+') {
        allLeads = allLeads.filter((l) => (l.businessAge?.years ?? 0) > 5);
      }
    }

    // Apply website presence filter
    if (hasWebsite === 'no-site') {
      allLeads = allLeads.filter((l) => !l.contact?.hasWebsite);
    } else if (hasWebsite === 'has-site') {
      allLeads = allLeads.filter((l) => l.contact?.hasWebsite);
    }

    // Apply query search
    if (query) {
      const q = query.toLowerCase();
      allLeads = allLeads.filter(
        (l) =>
          l.businessName?.toLowerCase().includes(q) ||
          l.title?.toLowerCase().includes(q) ||
          l.city?.toLowerCase().includes(q) ||
          l.category?.toLowerCase().includes(q) ||
          l.platform?.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q) ||
          l.contact?.email?.toLowerCase().includes(q) ||
          l.contact?.contactPerson?.toLowerCase().includes(q)
      );
    }

    // Multi-attribute deduplication across ID, domain, email, phone, and business name
    const seenIds = new Set<string>();
    const seenEmails = new Set<string>();
    const seenDomains = new Set<string>();
    const seenPhones = new Set<string>();
    const seenBusinessKeys = new Set<string>();
    let deduplicatedLeads: Lead[] = [];

    for (const lead of allLeads) {
      const primaryKey = (lead.id || '').trim().toLowerCase();
      const emailKey = normalizeEmailKey(lead.contact?.email);
      const domainKey = extractCanonicalDomain(lead.contact?.website);
      const phoneKey = normalizePhoneKey(lead.contact?.phone);
      const nameStr = (lead.businessName || lead.title || '').trim().toLowerCase();
      const isGenericName = !nameStr || ['direct client', 'enterprise client', 'client', 'partner', 'software organization', 'registered corporation'].includes(nameStr);
      const locStr = (lead.city || lead.country || '').trim().toLowerCase();
      const businessKey = (!isGenericName && nameStr) ? `${nameStr}::${locStr}` : '';

      const isDuplicate =
        (primaryKey && seenIds.has(primaryKey)) ||
        (emailKey && seenEmails.has(emailKey)) ||
        (domainKey && seenDomains.has(domainKey)) ||
        (phoneKey && seenPhones.has(phoneKey)) ||
        (businessKey && seenBusinessKeys.has(businessKey));

      if (!isDuplicate) {
        if (primaryKey) seenIds.add(primaryKey);
        if (emailKey) seenEmails.add(emailKey);
        if (domainKey) seenDomains.add(domainKey);
        if (phoneKey) seenPhones.add(phoneKey);
        if (businessKey) seenBusinessKeys.add(businessKey);
        deduplicatedLeads.push(lead);
      }
    }

    // Sort by newest incoming arrival timestamp so fresh live leads appear first
    deduplicatedLeads.sort((a, b) => {
      const timeA = typeof a.incomingAt === 'number' ? a.incomingAt : 0;
      const timeB = typeof b.incomingAt === 'number' ? b.incomingAt : 0;
      return timeB - timeA;
    });

    // When viewing all platforms, ensure a diverse, multi-platform interleaved distribution
    // WITHOUT burying fresh live arrivals!
    if (platform === 'all') {
      // 1. Fresh Live Influx (arrived within the last 15 minutes or flagged as brand new)
      // These MUST stay at the very top of the feed in recency order so the user sees live streaming!
      const freshWindowMs = 15 * 60 * 1000;
      const now = Date.now();
      const freshLeads: Lead[] = [];
      const catalogLeads: Lead[] = [];

      for (const lead of deduplicatedLeads) {
        const arrival = typeof lead.incomingAt === 'number' ? lead.incomingAt : 0;
        if ((now - arrival < freshWindowMs && arrival > 0) || (lead as any).isBrandNew) {
          freshLeads.push(lead);
        } else {
          catalogLeads.push(lead);
        }
      }

      // 2. Partition catalog leads into platform buckets
      const platformBuckets: Record<string, Lead[]> = {};
      for (const lead of catalogLeads) {
        const plat = (lead.platform || 'Other').toLowerCase();
        let bucketKey = 'other';
        if (plat.includes('google') || plat.includes('gmb') || plat.includes('map')) bucketKey = 'gmb';
        else if (plat.includes('upwork')) bucketKey = 'upwork';
        else if (plat.includes('linkedin')) bucketKey = 'linkedin';
        else if (plat.includes('bark')) bucketKey = 'bark';
        else if (plat.includes('remote') || plat.includes('remotive')) bucketKey = 'remote';
        else if (plat.includes('freelancer')) bucketKey = 'freelancer';

        if (!platformBuckets[bucketKey]) platformBuckets[bucketKey] = [];
        platformBuckets[bucketKey].push(lead);
      }

      // 3. Dynamically order buckets by the newest lead in each bucket,
      // and rotate the starting channel over time (shifts every 20s) so catalog is never frozen on the same lead
      const availableBuckets = Object.keys(platformBuckets).filter((k) => (platformBuckets[k]?.length || 0) > 0);
      availableBuckets.sort((a, b) => {
        const timeA = platformBuckets[a][0]?.incomingAt || 0;
        const timeB = platformBuckets[b][0]?.incomingAt || 0;
        return timeB - timeA;
      });

      const rotationOffset = Math.floor(now / 20000) % Math.max(1, availableBuckets.length);
      const rotatedBucketOrder = [
        ...availableBuckets.slice(rotationOffset),
        ...availableBuckets.slice(0, rotationOffset),
      ];

      const interleaved: Lead[] = [];
      let round = 0;
      let hasMoreItems = true;
      while (hasMoreItems) {
        hasMoreItems = false;
        for (const key of rotatedBucketOrder) {
          const bucket = platformBuckets[key];
          if (bucket && round < bucket.length) {
            interleaved.push(bucket[round]);
            hasMoreItems = true;
          }
        }
        round++;
      }

      // Fresh leads always take precedence at position 0, 1, 2... followed by balanced interleaved catalog
      deduplicatedLeads = [...freshLeads, ...interleaved];
    }

    // Strip heavy generatedWebsite object from list responses unless requested with ?full=true
    const sanitizedLeads = deduplicatedLeads.map((l) => {
      if (full) return l;
      const { generatedWebsite, ...rest } = l;
      return {
        ...rest,
        hasGeneratedWebsite: Boolean(generatedWebsite),
      };
    });

    const total = sanitizedLeads.length;
    const startIndex = (page - 1) * limit;
    const paginatedLeads = limit > 0 ? sanitizedLeads.slice(startIndex, startIndex + limit) : sanitizedLeads;
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;
    const hasMore = limit > 0 ? startIndex + limit < total : false;

    return NextResponse.json({
      success: true,
      isLiveSynced: true,
      total,
      page,
      limit: limit || total,
      totalPages,
      hasMore,
      leads: paginatedLeads,
      isGlobalView: isSuperAdminOrGlobal,
      activeUserId: activeUser?.id || (isSuperAdminOrGlobal ? 'global_all' : null),
      activeUserName: activeUser?.name || 'All Leads Master Pool',
      pipelineStats: computeLeadWorkspaceStats(effectiveUser.userId, deduplicatedLeads),
      stats: {
        totalGmb: deduplicatedLeads.filter((l) => l.type === 'gmb').length,
        totalJobs: deduplicatedLeads.filter((l) => l.type === 'job').length,
        newBusinesses: deduplicatedLeads.filter((l) => l.businessAge?.isNew).length,
        noWebsiteOpportunity: deduplicatedLeads.filter((l) => !l.contact?.hasWebsite).length,
        uaeLeads: deduplicatedLeads.filter((l) => matchesCountry(l.country, l.city, l.address, 'UAE', l.contact?.phone)).length,
        pakistanLeads: deduplicatedLeads.filter((l) => matchesCountry(l.country, l.city, l.address, 'Pakistan', l.contact?.phone)).length,
        usLeads: deduplicatedLeads.filter((l) => matchesCountry(l.country, l.city, l.address, 'US', l.contact?.phone)).length,
        ukLeads: deduplicatedLeads.filter((l) => matchesCountry(l.country, l.city, l.address, 'UK', l.contact?.phone)).length,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/leads route:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/leads - Create new lead with duplicate checking and persistence
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, businessName, country, city, category, platform, type, contact, budget, description } = body;

    if (!title || !businessName) {
      return NextResponse.json(
        { success: false, error: 'Business name and title are required' },
        { status: 400 }
      );
    }

    const newLead: Lead = {
      id: body.id || `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      businessName,
      type: type || 'gmb',
      platform: platform || 'Direct Client',
      category: category || 'Local Business',
      country: country || 'UAE',
      city: city || 'Dubai',
      address: body.address || `${city || 'Dubai'}, ${country || 'UAE'}`,
      businessAge: {
        years: 2,
        months: 0,
        isNew: false,
        label: 'Established Enterprise',
        badgeColor: 'blue',
      },
      budget: budget || 'Scope Confirmed',
      jobType: body.jobType || 'Direct Client',
      description: description || `Client engagement with ${businessName}`,
      postedAt: 'Just now',
      contact: contact || { hasWebsite: false },
      rating: 5.0,
      reviewCount: 1,
      tags: body.tags || ['Direct Lead', 'User Created'],
      verified: true,
      pipelineStage: body.pipelineStage || 'new',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    newLead.scoreBreakdown = calculateExplainableLeadScore(newLead);
    persistDiscoveredLeads([newLead]);

    return NextResponse.json({ success: true, lead: newLead });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to create lead' }, { status: 500 });
  }
}

/**
 * PUT /api/leads - Update lead attributes and pipeline stage
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, pipelineStage, notes, tags } = body;

    if (!leadId) {
      return NextResponse.json({ success: false, error: 'leadId is required' }, { status: 400 });
    }

    const updated = updateStoredLead(leadId, {
      pipelineStage,
      tags: tags || undefined,
    });

    return NextResponse.json({
      success: true,
      leadId,
      updatedStage: pipelineStage,
      updated,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to update lead' }, { status: 500 });
  }
}

/**
 * DELETE /api/leads - Delete or archive a lead
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('id');

    if (!leadId) {
      return NextResponse.json({ success: false, error: 'id query parameter required' }, { status: 400 });
    }

    deleteStoredLead(leadId);

    return NextResponse.json({
      success: true,
      deletedId: leadId,
      status: 'removed',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to delete lead' }, { status: 500 });
  }
}
