import { NextRequest, NextResponse } from 'next/server';
import { getCustomerDashboardMetrics, getSaasUserById } from '@/lib/saas-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('samvero_portal_token')?.value;
    const userId = request.cookies.get('samvero_user_id')?.value;
    const role = request.cookies.get('samvero_portal_role')?.value;

    if (!token || !userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    // Resolve target customer (If admin previewing, check query param or fallback to user-client-101)
    let targetCustomerId = userId;
    if (role === 'admin' || role === 'super_admin') {
      const { searchParams } = new URL(request.url);
      const previewId = searchParams.get('customerId');
      if (previewId) targetCustomerId = previewId;
      else targetCustomerId = 'user-client-101';
    }

    const metrics = getCustomerDashboardMetrics(targetCustomerId);
    return NextResponse.json({ success: true, metrics });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
