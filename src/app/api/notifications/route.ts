import { NextRequest, NextResponse } from 'next/server';
import { getNotificationsForUser, markNotificationAsRead } from '@/lib/saas-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const roleCookie = request.cookies.get('samvero_portal_role')?.value;
    const userId = request.cookies.get('samvero_user_id')?.value;

    const userRole = roleCookie === 'admin' || roleCookie === 'super_admin' ? 'admin' : 'customer';
    const notifications = getNotificationsForUser(userRole, userId);

    return NextResponse.json({ success: true, notifications });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json({ success: false, error: 'Notification ID required' }, { status: 400 });
    }

    const success = markNotificationAsRead(notificationId);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
