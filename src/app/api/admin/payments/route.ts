import { NextRequest, NextResponse } from 'next/server';
import { getAllPayments, confirmManualPayment, recordDirectManualPayment } from '@/lib/saas-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const roleCookie = request.cookies.get('samvero_portal_role')?.value;
    const token = request.cookies.get('samvero_portal_token')?.value;

    if (!token || (roleCookie !== 'admin' && roleCookie !== 'super_admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const payments = getAllPayments();
    return NextResponse.json({ success: true, payments });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const roleCookie = request.cookies.get('samvero_portal_role')?.value;
    const token = request.cookies.get('samvero_portal_token')?.value;

    if (!token || (roleCookie !== 'admin' && roleCookie !== 'super_admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const adminEmail = request.cookies.get('samvero_portal_user')?.value || 'Admin';

    // Direct recording action
    if (body.action === 'create' || body.customerEmail) {
      const {
        customerId,
        customerName,
        customerEmail,
        planId,
        billingDuration,
        amountReceived,
        paymentMethod,
        paymentReference,
        paymentDate,
        adminNotes,
      } = body;

      if (!customerName || !customerEmail || !planId || !amountReceived || !paymentReference) {
        return NextResponse.json(
          { success: false, error: 'Customer name, email, plan, amount, and reference are required' },
          { status: 400 }
        );
      }

      const payment = recordDirectManualPayment({
        customerId,
        customerName,
        customerEmail,
        planId,
        billingDuration: billingDuration || 'monthly',
        amountReceived: Number(amountReceived),
        paymentMethod: paymentMethod || 'Bank Wire Transfer',
        paymentReference,
        paymentDate,
        adminNotes,
        adminEmail,
      });

      return NextResponse.json({ success: true, payment });
    }

    // Default or confirm action
    const { paymentId, notes } = body;
    if (!paymentId) {
      return NextResponse.json({ success: false, error: 'Payment ID is required' }, { status: 400 });
    }

    const confirmed = confirmManualPayment(paymentId, adminEmail, notes);
    return NextResponse.json({ success: true, payment: confirmed });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to process payment' }, { status: 500 });
  }
}
