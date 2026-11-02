import { NextRequest, NextResponse } from 'next/server';
import { getEffectiveUser } from '@/lib/auth-user';
import {
  addLeadFollowup,
  updateLeadFollowupStatus,
  getLeadFollowups,
} from '@/lib/lead-workspace-store';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getEffectiveUser(request);
    const followups = getLeadFollowups(user.userId, params.id);
    return NextResponse.json({ success: true, followups });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getEffectiveUser(request);
    const body = await request.json();
    const { dueDate, notes = '' } = body;

    if (!dueDate) {
      return NextResponse.json({ success: false, error: 'dueDate is required' }, { status: 400 });
    }

    const followup = addLeadFollowup(user.userId, params.id, dueDate, notes);
    return NextResponse.json({
      success: true,
      message: 'Follow-up scheduled.',
      followup,
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
    const body = await request.json();
    const { followupId, status, newDueDate } = body;

    if (!followupId || !status) {
      return NextResponse.json(
        { success: false, error: 'followupId and status are required' },
        { status: 400 }
      );
    }

    const updated = updateLeadFollowupStatus(user.userId, followupId, status, newDueDate);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Followup record not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Followup marked as ${status}.`,
      followup: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
