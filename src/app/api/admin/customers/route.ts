import { NextRequest, NextResponse } from 'next/server';
import {
  getAllSaasUsers,
  getSaasUserById,
  updateSaasUser,
  toggleUserAccountStatus,
  manuallyAssignPackageToCustomer,
  extendCustomerSubscription,
  createSaasCustomer,
  hashPassword,
} from '@/lib/saas-store';
import { getAuthenticatedSession } from '@/lib/session';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = getAuthenticatedSession(request);
    if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const users = getAllSaasUsers();
    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = getAuthenticatedSession(request);
    if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { action, userId, planId, billingDuration, status, additionalDays, newPassword } = body;

    const adminEmail = request.cookies.get('samvero_portal_user')?.value || 'Admin';

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    // 1. Suspend / Reactivate Status
    if (action === 'toggle_status' && status) {
      const user = toggleUserAccountStatus(userId, status, adminEmail);
      return NextResponse.json({ success: true, user });
    }

    // 2. Assign / Change Package
    if (action === 'assign_package' && planId) {
      const sub = manuallyAssignPackageToCustomer({
        userId,
        planId,
        billingDuration: billingDuration || 'monthly',
        adminEmail,
      });
      return NextResponse.json({ success: true, subscription: sub });
    }

    // 3. Extend Subscription
    if (action === 'extend_subscription') {
      const user = getSaasUserById(userId);
      const allUsers = getAllSaasUsers();
      const targetUser = allUsers.find((u) => u.id === userId);
      if (!targetUser?.activeSubscription) {
        return NextResponse.json({ success: false, error: 'No active subscription found for user' }, { status: 400 });
      }

      const sub = extendCustomerSubscription({
        subscriptionId: targetUser.activeSubscription.id,
        additionalDays: Number(additionalDays || 30),
        reason: body.reason || 'Admin manual extension',
        adminEmail,
      });
      return NextResponse.json({ success: true, subscription: sub });
    }

    // 4. Reset Password
    if (action === 'reset_password') {
      const resetPass = newPassword || `Samvero#${Math.floor(100000 + Math.random() * 900000)}!`;
      const updated = updateSaasUser(
        userId,
        {
          passwordHash: hashPassword(resetPass),
          mustChangePassword: true,
        },
        adminEmail
      );
      return NextResponse.json({
        success: true,
        message: 'Password successfully reset.',
        temporaryPassword: resetPass,
      });
    }

    // 5. Update Profile Fields
    if (action === 'update_profile') {
      const updated = updateSaasUser(userId, body.updates || {}, adminEmail);
      return NextResponse.json({ success: true, user: updated });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getAuthenticatedSession(request);
    if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const adminEmail = request.cookies.get('samvero_portal_user')?.value || session.email || 'Admin';
    const body = await request.json();
    const {
      name,
      email,
      password,
      businessName,
      phone,
      whatsapp,
      country,
      planId,
      billingDuration,
      leadQuotaOverride,
      notes,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Client full name is required.' }, { status: 400 });
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'A valid email address is required.' }, { status: 400 });
    }

    const result = createSaasCustomer({
      name,
      email,
      password,
      businessName,
      phone,
      whatsapp,
      country,
      planId: planId || 'plan-starter',
      billingDuration: billingDuration || 'monthly',
      leadQuotaOverride: leadQuotaOverride ? Number(leadQuotaOverride) : undefined,
      adminEmail,
      notes,
    });

    return NextResponse.json({
      success: true,
      message: `Client ${result.user.name} created successfully!`,
      user: result.user,
      subscription: result.subscription,
      temporaryPassword: result.temporaryPassword,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to create client' }, { status: 400 });
  }
}
