import { NextRequest, NextResponse } from 'next/server';
import {
  getAllSubscriptions,
  getAllSubscriptionHistory,
  adjustSubscriptionQuota,
  updateSubscriptionStatus,
  extendCustomerSubscription,
  getAllRenewals,
} from '@/lib/saas-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const roleCookie = request.cookies.get('samvero_portal_role')?.value;
    const token = request.cookies.get('samvero_portal_token')?.value;

    if (!token || (roleCookie !== 'admin' && roleCookie !== 'super_admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const subscriptions = getAllSubscriptions();
    const history = getAllSubscriptionHistory();
    const renewals = getAllRenewals();

    return NextResponse.json({
      success: true,
      subscriptions,
      history,
      renewals,
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
    const { action, subscriptionId, newQuota, status, additionalDays, newExpiryDate, reason } = body;

    const adminEmail = request.cookies.get('samvero_portal_user')?.value || 'Admin';

    if (action === 'adjust_quota') {
      if (!subscriptionId || newQuota === undefined) {
        return NextResponse.json({ success: false, error: 'Subscription ID and new quota are required' }, { status: 400 });
      }
      const updated = adjustSubscriptionQuota(subscriptionId, Number(newQuota), reason, adminEmail);
      return NextResponse.json({ success: true, subscription: updated });
    }

    if (action === 'update_status') {
      if (!subscriptionId || !status) {
        return NextResponse.json({ success: false, error: 'Subscription ID and status are required' }, { status: 400 });
      }
      const updated = updateSubscriptionStatus(subscriptionId, status, reason, adminEmail);
      return NextResponse.json({ success: true, subscription: updated });
    }

    if (action === 'extend_expiry') {
      if (!subscriptionId) {
        return NextResponse.json({ success: false, error: 'Subscription ID is required' }, { status: 400 });
      }
      const updated = extendCustomerSubscription({
        subscriptionId,
        additionalDays: additionalDays ? Number(additionalDays) : 30,
        newExpiryDate,
        reason: reason || 'Admin manual extension',
        adminEmail,
      });
      return NextResponse.json({ success: true, subscription: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid action specified' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to update subscription' }, { status: 500 });
  }
}

export { PATCH as PUT };
