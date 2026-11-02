import { NextRequest, NextResponse } from 'next/server';
import { getEffectiveUser } from '@/lib/auth-user';
import {
  getAllUserLeadStates,
  computeLeadWorkspaceStats,
  LeadStatusType,
} from '@/lib/lead-workspace-store';
import { getAllRegisteredLeads } from '@/lib/lead-store';
import { Lead } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = getEffectiveUser(request);
    const { searchParams } = new URL(request.url);
    const targetStatus = searchParams.get('status') as LeadStatusType | 'all' | null;
    const categoryFilter = searchParams.get('category') || 'all';
    const query = (searchParams.get('q') || '').toLowerCase().trim();

    // 1. Fetch master leads pool
    const allLeads = await getAllRegisteredLeads();
    const userStates = getAllUserLeadStates(user.userId);

    // 2. Attach user-specific status & timestamps to each lead
    const leadsWithState = allLeads.map((lead) => {
      const state = userStates[lead.id];
      const currentStatus: LeadStatusType = state ? state.status : 'New Lead';
      return {
        ...lead,
        currentStatus,
        approachedAt: state?.approachedAt,
        lastContactDate: state?.lastContactDate,
        nextFollowupDate: state?.nextFollowupDate,
        openedAt: state?.openedAt,
      };
    });

    // 3. Compute real database statistics
    const stats = computeLeadWorkspaceStats(user.userId, allLeads);

    // 4. Filter leads according to request
    let filtered = leadsWithState;

    if (targetStatus && targetStatus !== 'all') {
      filtered = filtered.filter((l) => l.currentStatus === targetStatus);
    } else {
      // By default for "Approached Clients" section, show leads that have been approached or active in pipeline
      // (Approached, Waiting for Client Response, Follow-up Required, Interested, Converted / Won)
      filtered = filtered.filter(
        (l) => l.currentStatus !== 'New Lead'
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((l) => l.category.toLowerCase().includes(categoryFilter.toLowerCase()));
    }

    if (query) {
      filtered = filtered.filter(
        (l) =>
          l.businessName.toLowerCase().includes(query) ||
          l.title.toLowerCase().includes(query) ||
          l.city.toLowerCase().includes(query) ||
          l.country.toLowerCase().includes(query) ||
          (l.contact?.contactPerson && l.contact.contactPerson.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({
      success: true,
      stats,
      total: filtered.length,
      leads: filtered,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
