import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MASTER_PASSWORD = process.env.PORTAL_ACCESS_PASSWORD || 'Samvero#Secure9842';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
    }

    if (password.trim() === MASTER_PASSWORD.trim()) {
      const response = NextResponse.json({
        success: true,
        message: 'Access granted to SAMVERO Executive Portal',
      });

      // Set cookie that lasts for 30 days
      response.cookies.set({
        name: 'samvero_portal_token',
        value: 'authenticated_' + Buffer.from(MASTER_PASSWORD).toString('base64').substring(0, 16),
        httpOnly: false, // Accessible to client check
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, error: 'Incorrect portal access key. Access denied.' },
        { status: 401 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('samvero_portal_token')?.value;
    const expected = 'authenticated_' + Buffer.from(MASTER_PASSWORD).toString('base64').substring(0, 16);

    const isAuthenticated = token === expected;

    return NextResponse.json({
      success: true,
      authenticated: isAuthenticated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
