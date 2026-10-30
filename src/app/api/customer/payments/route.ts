import { NextRequest, NextResponse } from 'next/server';
import { getCustomerPayments } from '@/lib/saas-store';
import { getAuthenticatedSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = getAuthenticatedSession(request);
    const userIdCookie = request.cookies.get('samvero_user_id')?.value;
    const token = request.cookies.get('samvero_portal_token')?.value;

    if (!token && !session) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    let targetCustomerId = session ? session.userId : (userIdCookie || 'user-client-101');

    // Admin can preview specific customer
    const role = session ? session.role : request.cookies.get('samvero_portal_role')?.value;
    if (role === 'admin' || role === 'super_admin') {
      const { searchParams } = new URL(request.url);
      const previewId = searchParams.get('customerId');
      if (previewId) targetCustomerId = previewId;
    }

    const payments = getCustomerPayments(targetCustomerId);
    return NextResponse.json({ success: true, payments });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
