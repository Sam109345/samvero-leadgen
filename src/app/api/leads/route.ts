import { NextRequest, NextResponse } from 'next/server';
import { fetchGmbLeads } from '@/lib/gmb-service';
import { fetchFreelanceJobs } from '@/lib/jobs-service';
import { getMasterRealTimeLiveLeads } from '@/lib/live-lead-aggregator';
import { getLeadsFromSupabase } from '@/lib/supabase';
import { Lead } from '@/types';
import { getPortalUserById, getLeadAssignedUser } from '@/lib/user-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'all';
    const category = searchParams.get('category') || 'all';
    const businessAge = searchParams.get('businessAge') || 'all';
    const platform = searchParams.get('platform') || 'all';
    const type = searchParams.get('type') || 'all'; // 'gmb', 'job', 'all'
    const query = searchParams.get('q') || '';
    const hasWebsite = searchParams.get('hasWebsite') || 'all';
    const requestedUserId = searchParams.get('userId') || request.cookies.get('samvero_user_id')?.value;
    const requestedScope = searchParams.get('scope'); // 'all' | 'mine'

    const refresh = searchParams.get('refresh');
    const forceRefresh = refresh === 'live';

    let allLeads: Lead[] = [];

    // 1. Fetch 100% REAL-TIME LIVE LEADS from multi-platform aggregator
    try {
      const liveLeads = await getMasterRealTimeLiveLeads({
        query,
        country,
        category,
        platform,
        forceRefresh,
      });

      if (liveLeads && liveLeads.length > 0) {
        if (type === 'gmb') {
          allLeads = liveLeads.filter((l) => l.type === 'gmb');
        } else if (type === 'job') {
          allLeads = liveLeads.filter((l) => l.type === 'job');
        } else {
          allLeads = liveLeads;
        }
      }
    } catch (err) {
      console.warn('Real-time live aggregator issue, proceeding to fallback:', err);
    }

    // 2. Check if Supabase PostgreSQL database is connected and populated
    if (allLeads.length === 0) {
      const supabaseLeads = await getLeadsFromSupabase();
      if (supabaseLeads && supabaseLeads.length > 0) {
        allLeads = supabaseLeads;
      } else {
        // 3. Fallback to active services if live leads pool is empty
        if (type === 'gmb') {
          allLeads = await fetchGmbLeads({ query, country, category });
        } else if (type === 'job') {
          allLeads = await fetchFreelanceJobs({ query, country, category, platform });
        } else {
          const [gmbLeads, jobLeads] = await Promise.all([
            fetchGmbLeads({ query, country, category }),
            fetchFreelanceJobs({ query, country, category, platform }),
          ]);
          allLeads = [...gmbLeads, ...jobLeads];
        }
      }
    }

    // Attach real assigned user attribution to each lead
    allLeads = allLeads.map((lead) => {
      const assignedUser = getLeadAssignedUser(lead.id);
      return {
        ...lead,
        assignedToUserId: assignedUser?.id,
        assignedToUserName: assignedUser?.name,
      };
    });

    // 3. User Permission & Role Check
    const portalRole = request.cookies.get('samvero_portal_role')?.value;
    const isGlobalCookie = request.cookies.get('samvero_is_global')?.value === 'true';

    const activeUser = requestedUserId ? getPortalUserById(requestedUserId) : undefined;
    const isSuperAdminOrGlobal = 
      requestedScope === 'all' ||
      !activeUser || 
      activeUser.isGlobalUser || 
      activeUser.role === 'admin' || 
      activeUser.role === 'global_user' ||
      portalRole === 'admin' ||
      isGlobalCookie;

    // If staff user and NOT global: strictly filter to ONLY their assigned leads!
    if (!isSuperAdminOrGlobal && activeUser) {
      allLeads = allLeads.filter((l) => l.assignedToUserId === activeUser.id);
    }

    // Apply country filter
    if (country !== 'all') {
      allLeads = allLeads.filter((l) => l.country.toLowerCase() === country.toLowerCase());
    }

    // Apply category filter
    if (category !== 'all') {
      allLeads = allLeads.filter((l) => l.category.toLowerCase().includes(category.toLowerCase()));
    }

    // Apply platform filter
    if (platform !== 'all') {
      allLeads = allLeads.filter((l) => l.platform.toLowerCase() === platform.toLowerCase());
    }

    // Apply business age filter
    if (businessAge !== 'all') {
      if (businessAge === 'new') {
        allLeads = allLeads.filter((l) => l.businessAge.isNew);
      } else if (businessAge === '1-3') {
        allLeads = allLeads.filter((l) => l.businessAge.years >= 1 && l.businessAge.years <= 3);
      } else if (businessAge === '3-5') {
        allLeads = allLeads.filter((l) => l.businessAge.years > 3 && l.businessAge.years <= 5);
      } else if (businessAge === '5+') {
        allLeads = allLeads.filter((l) => l.businessAge.years > 5);
      }
    }

    // Apply website presence filter
    if (hasWebsite === 'no-site') {
      allLeads = allLeads.filter((l) => !l.contact.hasWebsite);
    } else if (hasWebsite === 'has-site') {
      allLeads = allLeads.filter((l) => l.contact.hasWebsite);
    }

    // Strict de-duplication: Ensure ZERO duplicate leads by ID or Business/Title
    const seenKeys = new Set<string>();
    const deduplicatedLeads: Lead[] = [];

    for (const lead of allLeads) {
      const primaryKey = lead.id.trim().toLowerCase();
      const contentKey = `${(lead.businessName || lead.title || '').trim().toLowerCase()}::${(lead.city || '').trim().toLowerCase()}`;
      
      if (!seenKeys.has(primaryKey) && !seenKeys.has(contentKey)) {
        seenKeys.add(primaryKey);
        seenKeys.add(contentKey);
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
      stats: {
        totalGmb: deduplicatedLeads.filter((l) => l.type === 'gmb').length,
        totalJobs: deduplicatedLeads.filter((l) => l.type === 'job').length,
        newBusinesses: deduplicatedLeads.filter((l) => l.businessAge.isNew).length,
        noWebsiteOpportunity: deduplicatedLeads.filter((l) => !l.contact.hasWebsite).length,
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
