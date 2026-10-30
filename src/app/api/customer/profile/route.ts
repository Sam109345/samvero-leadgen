import { NextRequest, NextResponse } from 'next/server';
import { updateCustomerProfile, getSaasUserById } from '@/lib/saas-store';
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

    const targetUserId = session ? session.userId : (userIdCookie || 'user-client-101');
    const user = getSaasUserById(targetUserId);

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const { passwordHash, ...safeUser } = user;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = getAuthenticatedSession(request);
    const userIdCookie = request.cookies.get('samvero_user_id')?.value;
    const token = request.cookies.get('samvero_portal_token')?.value;

    if (!token && !session) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const targetUserId = session ? session.userId : (userIdCookie || 'user-client-101');
    const body = await request.json();

    const result = updateCustomerProfile(targetUserId, {
      name: body.name,
      businessName: body.businessName,
      phone: body.phone,
      whatsapp: body.whatsapp,
      country: body.country,
      companyWebsite: body.companyWebsite,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    const { passwordHash, ...safeUser } = result.user!;
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: safeUser,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
