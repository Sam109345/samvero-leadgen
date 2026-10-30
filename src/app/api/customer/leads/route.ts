import { NextRequest, NextResponse } from 'next/server';
import {
  getCustomerLeads,
  consumeLeadForCustomer,
  updateCustomerLeadRecord,
  deleteCustomerLeadRecord,
} from '@/lib/saas-store';
import { getLeadById } from '@/lib/lead-store';
import { getLiveLeadById } from '@/lib/live-lead-aggregator';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('samvero_portal_token')?.value;
    const userId = request.cookies.get('samvero_user_id')?.value;
    const role = request.cookies.get('samvero_portal_role')?.value;

    if (!token || !userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    let targetCustomerId = userId;
    if (role === 'admin' || role === 'super_admin') {
      const { searchParams } = new URL(request.url);
      const previewId = searchParams.get('customerId');
      if (previewId) targetCustomerId = previewId;
      else targetCustomerId = 'user-client-101';
    }

    const leads = getCustomerLeads(targetCustomerId);
    return NextResponse.json({ success: true, leads });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('samvero_portal_token')?.value;
    const userId = request.cookies.get('samvero_user_id')?.value;

    if (!token || !userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { leadId } = body;

    if (!leadId) {
      return NextResponse.json({ success: false, error: 'Lead ID is required' }, { status: 400 });
    }

    const targetLead = getLeadById(leadId) || getLiveLeadById(leadId);
    if (!targetLead) {
      return NextResponse.json({ success: false, error: 'Lead record not found' }, { status: 404 });
    }

    // Atomic server-side quota enforcement
    const result = consumeLeadForCustomer(userId, targetLead);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          quotaExceeded: true,
          remainingQuota: result.remainingQuota || 0,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lead saved to customer account successfully.',
      customerLead: result.customerLead,
      remainingQuota: result.remainingQuota,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('samvero_portal_token')?.value;
    const userId = request.cookies.get('samvero_user_id')?.value;

    if (!token || !userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { leadId, status, notes, tags } = body;

    if (!leadId) {
      return NextResponse.json({ success: false, error: 'Lead ID is required' }, { status: 400 });
    }

    const updated = updateCustomerLeadRecord(userId, leadId, {
      ...(status ? { status } : {}),
      ...(notes !== undefined ? { notes } : {}),
      ...(tags ? { tags } : {}),
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('samvero_portal_token')?.value;
    const userId = request.cookies.get('samvero_user_id')?.value;

    if (!token || !userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json({ success: false, error: 'Lead ID is required' }, { status: 400 });
    }

    const deleted = deleteCustomerLeadRecord(userId, leadId);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
