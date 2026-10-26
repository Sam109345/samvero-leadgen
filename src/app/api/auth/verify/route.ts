import { NextRequest, NextResponse } from 'next/server';
import { recordLoginSession } from '@/lib/audit-store';
import { getLivePublicIp, resolveIpDetails } from '@/lib/geo-ip';

export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.PORTAL_ADMIN_PASSWORD || 'Sameer1234!@#';
const EMPLOYER_PASSWORD = process.env.PORTAL_ACCESS_PASSWORD || 'Samvero#Secure9842';

function parseUserAgent(ua: string) {
  let os = 'Windows 11 PC';
  let browser = 'Chrome';

  if (ua.includes('Windows NT 10.0')) os = 'Windows 11 / 10 PC';
  else if (ua.includes('Macintosh') || ua.includes('Mac OS X')) os = 'macOS Workstation';
  else if (ua.includes('iPhone')) os = 'Apple iPhone iOS';
  else if (ua.includes('iPad')) os = 'Apple iPadOS';
  else if (ua.includes('Android')) os = 'Android Mobile';
  else if (ua.includes('Linux')) os = 'Linux Workstation';

  if (ua.includes('Edg/')) browser = 'Microsoft Edge';
  else if (ua.includes('Chrome/') && !ua.includes('Edg/')) browser = 'Google Chrome';
  else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Apple Safari';
  else if (ua.includes('Firefox/')) browser = 'Mozilla Firefox';

  return { os, browser };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, deviceName, locationHint, clientPublicIp } = body;

    if (!password) {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
    }

    const trimmedPassword = password.trim();

    let role: 'admin' | 'employer' | null = null;
    let userName = '';

    if (trimmedPassword === ADMIN_PASSWORD.trim()) {
      role = 'admin';
      userName = 'Sameer (Executive Admin)';
    } else if (
      trimmedPassword === EMPLOYER_PASSWORD.trim() ||
      trimmedPassword === 'Sameer12345!@#$%' // Backward compatibility
    ) {
      role = 'employer';
      userName = 'Employer Staff Desk';
    }

    if (!role) {
      return NextResponse.json(
        { success: false, error: 'Incorrect portal access key. Access denied.' },
        { status: 401 }
      );
    }

    // Live Public IP Detection
    const cfIp = request.headers.get('cf-connecting-ip');
    const xForwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0].trim();
    const xRealIp = request.headers.get('x-real-ip');
    const headerIp = cfIp || xForwardedFor || xRealIp;

    // Use client public IP hint if provided, or resolve live public IP
    const targetIp = clientPublicIp || (headerIp && !headerIp.startsWith('127.') && headerIp !== '::1' ? headerIp : await getLivePublicIp(headerIp || undefined));

    // Resolve real live geolocation & ISP
    const geo = await resolveIpDetails(targetIp);

    // Device and OS details
    const userAgent = request.headers.get('user-agent') || '';
    const { os, browser } = parseUserAgent(userAgent);

    const clientDeviceName = deviceName || (role === 'admin' ? `${os} (Executive Workstation)` : `${os} (Staff Terminal)`);
    const location = `${geo.city}, ${geo.country}`;

    // Record login into live audit history
    const session = recordLoginSession({
      role,
      userName,
      ipAddress: geo.ip,
      deviceName: clientDeviceName,
      browser,
      os,
      location,
      isp: geo.isp,
    });

    const response = NextResponse.json({
      success: true,
      message: `Access granted as ${role === 'admin' ? 'Super Executive Admin' : 'Employer Staff'}`,
      role,
      userName,
      sessionId: session.id,
      ipAddress: geo.ip,
      location,
      isp: geo.isp,
      deviceName: session.deviceName,
    });

    // Set secure authentication cookies
    const cookieOptions = {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    };

    response.cookies.set({
      name: 'samvero_portal_token',
      value: 'auth_' + Buffer.from(role + ':' + session.id).toString('base64'),
      ...cookieOptions,
    });

    response.cookies.set({
      name: 'samvero_portal_role',
      value: role,
      ...cookieOptions,
    });

    response.cookies.set({
      name: 'samvero_portal_session_id',
      value: session.id,
      ...cookieOptions,
    });

    response.cookies.set({
      name: 'samvero_portal_user',
      value: userName,
      ...cookieOptions,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('samvero_portal_token')?.value;
    const role = (request.cookies.get('samvero_portal_role')?.value as 'admin' | 'employer') || 'employer';
    const sessionId = request.cookies.get('samvero_portal_session_id')?.value || '';
    const userName = request.cookies.get('samvero_portal_user')?.value || (role === 'admin' ? 'Sameer (Executive Admin)' : 'Employer Staff');

    const isAuthenticated = !!token && token.startsWith('auth_');

    // Get live public IP
    const cfIp = request.headers.get('cf-connecting-ip');
    const xForwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0].trim();
    const xRealIp = request.headers.get('x-real-ip');
    const headerIp = cfIp || xForwardedFor || xRealIp;

    const publicIp = await getLivePublicIp(headerIp || undefined);
    const geo = await resolveIpDetails(publicIp);

    return NextResponse.json({
      success: true,
      authenticated: isAuthenticated,
      role: isAuthenticated ? role : null,
      userName: isAuthenticated ? userName : null,
      sessionId,
      currentIp: geo.ip,
      location: `${geo.city}, ${geo.country}`,
      isp: geo.isp,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
