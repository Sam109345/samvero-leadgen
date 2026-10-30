import { NextRequest, NextResponse } from 'next/server';
import { getSuperAdminDashboardMetrics } from '@/lib/saas-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const roleCookie = request.cookies.get('samvero_portal_role')?.value;
    const token = request.cookies.get('samvero_portal_token')?.value;

    if (!token || (roleCookie !== 'admin' && roleCookie !== 'super_admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const metrics = getSuperAdminDashboardMetrics();
    return NextResponse.json({ success: true, metrics });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
