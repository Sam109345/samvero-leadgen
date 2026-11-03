import { NextRequest, NextResponse } from 'next/server';
import { Lead } from '@/types';
import { getPortalUserById, getLeadAssignedUser } from '@/lib/user-store';
import { getSubscriptionById } from '@/lib/saas-store';
import { getEffectiveUser } from '@/lib/auth-user';
import { getAllUserLeadStates, computeLeadWorkspaceStats } from '@/lib/lead-workspace-store';
import { loadAllStoredLeads, persistDiscoveredLeads, deleteStoredLead, updateStoredLead, extractCanonicalDomain, normalizeEmailKey, normalizePhoneKey } from '@/lib/leads-persistent-store';
import { executeCentralLeadPipeline } from '@/lib/pipeline/central-lead-pipeline';
import { calculateExplainableLeadScore } from '@/lib/explainable-scoring';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const effectiveUser = getEffectiveUser(request);
    const userStates = getAllUserLeadStates(effectiveUser.userId);

    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'all';
    const category = searchParams.get('category') || 'all';
    const businessAge = searchParams.get('businessAge') || 'all';
    const platform = searchParams.get('platform') || 'all';
    const type = searchParams.get('type') || 'all';
    const query = searchParams.get('q') || '';
    const hasWebsite = searchParams.get('hasWebsite') || 'all';
    const statusParam = searchParams.get('status');
    const requestedUserId = searchParams.get('userId') || request.cookies.get('samvero_user_id')?.value;
    const requestedScope = searchParams.get('scope');

    const refresh = searchParams.get('refresh');
    const forceRefresh = refresh === 'live';

    let allLeads: Lead[] = loadAllStoredLeads();

    // If store is completely empty or forceRefresh requested, execute live discovery across operational sources
    if (allLeads.length === 0 || forceRefresh) {
      try {
        const pipelineResult = await executeCentralLeadPipeline({
          query: query || undefined,
          country: country !== 'all' ? country : undefined,
          category: category !== 'all' ? category : undefined,
          limit: 15,
          autoPersist: true,
        });

        if (pipelineResult.leads.length > 0) {
          allLeads = loadAllStoredLeads();
        }
      } catch (err) {
        console.warn('Pipeline discovery during lead fetch encounter:', err);
      }
    }

    // Attach real assigned user attribution and canonical user workspace status to each lead
    allLeads = allLeads.map((lead) => {
      const assignedUser = getLeadAssignedUser(lead.id);
      const uState = userStates[lead.id];
      const currentStatus = uState?.status || 'New Lead';
      return {
        ...lead,
        currentStatus,
        approachedAt: uState?.approachedAt,
        lastContactDate: uState?.lastContactDate,
        nextFollowupDate: uState?.nextFollowupDate,
        assignedToUserId: assignedUser?.id,
        assignedToUserName: assignedUser?.name,
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
      allLeads = allLeads.filter((l) => l.country?.toLowerCase() === country.toLowerCase());
    }

    // Apply category filter
    if (category !== 'all') {
      allLeads = allLeads.filter((l) => l.category?.toLowerCase().includes(category.toLowerCase()));
    }

    // Apply platform filter
    if (platform !== 'all') {
      allLeads = allLeads.filter((l) => l.platform?.toLowerCase().includes(platform.toLowerCase()));
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
    const deduplicatedLeads: Lead[] = [];

    for (const lead of allLeads) {
      const primaryKey = (lead.id || '').trim().toLowerCase();
      const emailKey = normalizeEmailKey(lead.contact?.email);
      const domainKey = extractCanonicalDomain(lead.contact?.website);
      const phoneKey = normalizePhoneKey(lead.contact?.phone);
      const nameStr = (lead.businessName || lead.title || '').trim().toLowerCase();
      const locStr = (lead.city || lead.country || '').trim().toLowerCase();
      const businessKey = nameStr ? `${nameStr}::${locStr}` : '';

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

    return NextResponse.json({
      success: true,
      isLiveSynced: true,
      total: deduplicatedLeads.length,
      leads: deduplicatedLeads,
      isGlobalView: isSuperAdminOrGlobal,
      activeUserId: activeUser?.id || (isSuperAdminOrGlobal ? 'global_all' : null),
      activeUserName: activeUser?.name || 'All Leads Master Pool',
      pipelineStats: computeLeadWorkspaceStats(effectiveUser.userId, deduplicatedLeads),
      stats: {
        totalGmb: deduplicatedLeads.filter((l) => l.type === 'gmb').length,
        totalJobs: deduplicatedLeads.filter((l) => l.type === 'job').length,
        newBusinesses: deduplicatedLeads.filter((l) => l.businessAge?.isNew).length,
        noWebsiteOpportunity: deduplicatedLeads.filter((l) => !l.contact?.hasWebsite).length,
        uaeLeads: deduplicatedLeads.filter((l) => l.country === 'UAE').length,
        pakistanLeads: deduplicatedLeads.filter((l) => l.country === 'Pakistan').length,
        usLeads: deduplicatedLeads.filter((l) => l.country === 'US').length,
        ukLeads: deduplicatedLeads.filter((l) => l.country === 'UK').length,
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
