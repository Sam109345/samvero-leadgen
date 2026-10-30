import { NextRequest, NextResponse } from 'next/server';
import { changeUserPassword, getSaasUserById } from '@/lib/saas-store';
import { getAuthenticatedSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, newPassword, currentPassword } = body;

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    // Determine target user
    let targetUserId = userId;

    // Check authenticated session if available
    const session = getAuthenticatedSession(request);
    if (session) {
      // Normal users can only change their own password
      if (session.role !== 'admin' && session.role !== 'super_admin') {
        targetUserId = session.userId;
      }
    }

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required to update credentials.' },
        { status: 400 }
      );
    }

    const user = getSaasUserById(targetUserId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User account not found.' }, { status: 404 });
    }

    // If not first-time password setup and no admin override, verify current password
    const requireCurrent = !user.mustChangePassword && (!session || (session.role !== 'admin' && session.role !== 'super_admin'));
    if (requireCurrent && !currentPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password is required to set a new password.' },
        { status: 400 }
      );
    }

    const result = changeUserPassword(targetUserId, newPassword, currentPassword);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
