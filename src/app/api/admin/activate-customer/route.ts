import { NextRequest, NextResponse } from 'next/server';
import { activateCustomerFromApplication } from '@/lib/saas-store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const roleCookie = request.cookies.get('samvero_portal_role')?.value;
    const token = request.cookies.get('samvero_portal_token')?.value;

    if (!token || (roleCookie !== 'admin' && roleCookie !== 'super_admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const {
      applicationId,
      planId,
      billingDuration,
      startDate,
      expiryDateOverride,
      amountReceived,
      paymentMethod,
      paymentReference,
      adminNotes,
    } = body;

    if (!applicationId || !planId || !billingDuration) {
      return NextResponse.json(
        { success: false, error: 'Application ID, plan ID, and billing duration are required.' },
        { status: 400 }
      );
    }

    const adminEmail = request.cookies.get('samvero_portal_user')?.value || 'Admin';

    const result = activateCustomerFromApplication({
      applicationId,
      planId,
      billingDuration,
      startDate,
      expiryDateOverride,
      paymentDetails: {
        amountReceived: Number(amountReceived || 0),
        paymentMethod: paymentMethod || 'Bank Wire Transfer',
        paymentReference: paymentReference || `WIRE-${Date.now()}`,
        adminNotes,
      },
      adminEmail,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Customer account provisioned and activated successfully.',
      user: result.user,
      subscription: result.subscription,
      payment: result.payment,
      temporaryPassword: result.temporaryPassword,
      activationLink: result.activationLink,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
