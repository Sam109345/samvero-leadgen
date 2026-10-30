import { NextRequest, NextResponse } from 'next/server';
import {
  getAllCustomerLeadsPool,
  updateCustomerLeadRecord,
  deleteCustomerLeadRecord,
} from '@/lib/saas-store';
import { getAllRegisteredLeads } from '@/lib/lead-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const roleCookie = request.cookies.get('samvero_portal_role')?.value;
    const token = request.cookies.get('samvero_portal_token')?.value;

    if (!token || (roleCookie !== 'admin' && roleCookie !== 'super_admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const customerLeads = getAllCustomerLeadsPool();
    const globalLeads = getAllRegisteredLeads();

    return NextResponse.json({
      success: true,
      customerLeads,
      totalGlobalLeads: globalLeads.length,
      globalLeadsSample: globalLeads.slice(0, 50),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const roleCookie = request.cookies.get('samvero_portal_role')?.value;
    const token = request.cookies.get('samvero_portal_token')?.value;

    if (!token || (roleCookie !== 'admin' && roleCookie !== 'super_admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { customerId, leadId, status, notes, tags } = body;

    if (!customerId || !leadId) {
      return NextResponse.json({ success: false, error: 'Customer ID and Lead ID are required' }, { status: 400 });
    }

    const updated = updateCustomerLeadRecord(customerId, leadId, {
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
    const roleCookie = request.cookies.get('samvero_portal_role')?.value;
    const token = request.cookies.get('samvero_portal_token')?.value;

    if (!token || (roleCookie !== 'admin' && roleCookie !== 'super_admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const leadId = searchParams.get('leadId');

    if (!customerId || !leadId) {
      return NextResponse.json({ success: false, error: 'Customer ID and Lead ID are required' }, { status: 400 });
    }

    const deleted = deleteCustomerLeadRecord(customerId, leadId);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
