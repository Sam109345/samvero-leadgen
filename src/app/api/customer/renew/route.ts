import { NextRequest, NextResponse } from 'next/server';
import { requestSubscriptionRenewal, confirmSubscriptionRenewal } from '@/lib/saas-store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('samvero_portal_token')?.value;
    const userId = request.cookies.get('samvero_user_id')?.value;
    const role = request.cookies.get('samvero_portal_role')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { action, renewalId, requestedPlanId, requestedDuration, customerNotes, paymentReference, paymentMethod } = body;

    // 1. Customer initiates renewal request
    if (action === 'request' || !action) {
      if (!userId) {
        return NextResponse.json({ success: false, error: 'User ID missing' }, { status: 401 });
      }

      const renewal = requestSubscriptionRenewal({
        customerId: userId,
        requestedPlanId: requestedPlanId || 'plan_standard',
        requestedDuration: requestedDuration || 'monthly',
        customerNotes,
      });

      return NextResponse.json({
        success: true,
        message: 'Renewal request submitted. Our team will review payment confirmation.',
        renewal,
      });
    }

    // 2. Admin confirms renewal
    if (action === 'confirm') {
      if (role !== 'admin' && role !== 'super_admin') {
        return NextResponse.json({ success: false, error: 'Admin authorization required' }, { status: 403 });
      }

      if (!renewalId || !paymentReference) {
        return NextResponse.json(
          { success: false, error: 'Renewal ID and payment reference are required.' },
          { status: 400 }
        );
      }

      const adminEmail = request.cookies.get('samvero_portal_user')?.value || 'Admin';
      const result = confirmSubscriptionRenewal({
        renewalId,
        paymentReference,
        paymentMethod: paymentMethod || 'Bank Wire Transfer',
        adminEmail,
        notes: body.notes,
      });

      return NextResponse.json({
        success: true,
        message: 'Renewal payment verified and subscription extended.',
        ...result,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
