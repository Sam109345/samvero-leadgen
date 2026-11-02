import { NextRequest, NextResponse } from 'next/server';
import { getEffectiveUser } from '@/lib/auth-user';
import { addLeadNote, getLeadNotes } from '@/lib/lead-workspace-store';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getEffectiveUser(request);
    const notes = getLeadNotes(user.userId, params.id);
    return NextResponse.json({ success: true, notes });
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
    const { content } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Note content cannot be empty' }, { status: 400 });
    }

    const note = addLeadNote(user.userId, params.id, content.trim());
    return NextResponse.json({
      success: true,
      message: 'Note added successfully.',
      note,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
