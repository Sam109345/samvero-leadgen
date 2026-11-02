import { NextRequest, NextResponse } from 'next/server';
import { getEffectiveUser } from '@/lib/auth-user';
import {
  getUserLeadState,
  updateUserLeadStatus,
  recordLeadOpened,
  getLeadActivityLogs,
  getLeadFollowups,
  getLeadNotes,
  getEmailDraftForLead,
  getBidDraftForLead,
  LeadStatusType,
} from '@/lib/lead-workspace-store';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getEffectiveUser(request);
    const leadId = params.id;

    if (!leadId) {
      return NextResponse.json({ success: false, error: 'Lead ID is required' }, { status: 400 });
    }

    // Record lead opened if not already logged
    recordLeadOpened(user.userId, leadId);

    const state = getUserLeadState(user.userId, leadId);
    const activityLogs = getLeadActivityLogs(user.userId, leadId);
    const followups = getLeadFollowups(user.userId, leadId);
    const notes = getLeadNotes(user.userId, leadId);
    const emailDraft = getEmailDraftForLead(user.userId, leadId);
    const bidDraft = getBidDraftForLead(user.userId, leadId);

    return NextResponse.json({
      success: true,
      leadId,
      status: state.status,
      approachedAt: state.approachedAt,
      lastContactDate: state.lastContactDate,
      nextFollowupDate: state.nextFollowupDate,
      openedAt: state.openedAt,
      activityLogs,
      followups,
      notes,
      emailDraft,
      bidDraft,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getEffectiveUser(request);
    const leadId = params.id;
    const body = await request.json();
    const { status, notes, nextFollowupDate, lastContactDate } = body;

    if (!leadId) {
      return NextResponse.json({ success: false, error: 'Lead ID is required' }, { status: 400 });
    }

    const validStatuses: LeadStatusType[] = [
      'New Lead',
      'Approached',
      'Waiting for Client Response',
      'Follow-up Required',
      'Interested',
      'Not Interested',
      'Wasted Lead',
      'Converted / Won',
      'Closed',
    ];

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const updated = updateUserLeadStatus(user.userId, leadId, status, {
      notes,
      nextFollowupDate,
      lastContactDate,
    });

    return NextResponse.json({
      success: true,
      message: `Lead status updated to "${status}".`,
      leadState: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
