import { NextRequest, NextResponse } from 'next/server';
import { getLeadById } from '@/lib/lead-store';
import { loadAllStoredLeads } from '@/lib/leads-persistent-store';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Lead ID is required' }, { status: 400 });
    }

    const lead = getLeadById(id) || loadAllStoredLeads().find((l) => l.id?.toLowerCase() === id.toLowerCase());

    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      lead,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Server error' },
      { status: 500 }
    );
  }
}
