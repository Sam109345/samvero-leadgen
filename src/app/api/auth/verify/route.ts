import { NextRequest, NextResponse } from 'next/server';
import { recordLoginSession } from '@/lib/audit-store';
import { getLivePublicIp, resolveIpDetails } from '@/lib/geo-ip';
import { getPortalUsers } from '@/lib/user-store';
import { signSession, verifySessionToken } from '@/lib/session';

export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.PORTAL_ADMIN_PASSWORD || '';
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

import { getAllSaasUsers, verifyPassword, ensureSaasStoreInitialized } from '@/lib/saas-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, username, email, deviceName, clientPublicIp } = body;

    if (!password) {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
    }

    const trimmedPassword = password.trim();
    const targetIdentifier = (email || username || '').trim().toLowerCase();

    let role: 'admin' | 'customer' | 'employer' | null = null;
    let userName = '';
    let userId = '';
    let isGlobalUser = false;
    let mustChangePassword = false;

    ensureSaasStoreInitialized();

    // 1. Check Multi-Tenant SaaS Users Store (Customer and Super Admin)
    const allSaasUsers = getAllSaasUsers();
    const saasUserMatch = allSaasUsers.find((u) => {
      const matchIdentity = targetIdentifier ? u.email.toLowerCase() === targetIdentifier : true;
      return matchIdentity && verifyPassword(trimmedPassword, u.passwordHash);
    });

    if (saasUserMatch) {
      if (saasUserMatch.status === 'suspended') {
        return NextResponse.json(
          { success: false, error: 'Your account has been suspended. Please contact customer support.' },
          { status: 403 }
        );
      }
      role = saasUserMatch.role === 'super_admin' || saasUserMatch.role === 'admin' ? 'admin' : (saasUserMatch.role === 'customer' ? 'customer' : 'employer');
      userName = saasUserMatch.name;
      userId = saasUserMatch.id;
      isGlobalUser = saasUserMatch.role === 'super_admin' || saasUserMatch.role === 'admin';
      mustChangePassword = saasUserMatch.mustChangePassword;
    }
    // 2. Direct Super Admin Master Key
    else if (trimmedPassword === ADMIN_PASSWORD.trim()) {
      role = 'admin';
      userName = 'Sameer (Executive Admin)';
      userId = 'user-sameer';
      isGlobalUser = true;
    } 
    // 3. Direct Employer Master Key
    else if (
      trimmedPassword === EMPLOYER_PASSWORD.trim() ||
      trimmedPassword === 'Sameer12345!@#$%' // Backward compatibility
    ) {
      role = 'employer';
      userName = 'Employer Staff Desk';
      userId = 'user-employer';
      isGlobalUser = false;
    }
    // 4. Custom Staff Users created by Admin
    else {
      const allUsers = getPortalUsers();
      const matchedUser = allUsers.find(
        (u) =>
          u.password === trimmedPassword &&
          (!targetIdentifier || u.username.toLowerCase() === targetIdentifier || u.email.toLowerCase() === targetIdentifier)
      );

      if (matchedUser) {
        role = matchedUser.role === 'admin' ? 'admin' : 'employer';
        userName = matchedUser.name;
        userId = matchedUser.id;
        isGlobalUser = matchedUser.isGlobalUser;
      }
    }

    if (!role) {
      return NextResponse.json(
        { success: false, error: 'Incorrect portal credentials. Access denied.' },
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

    const redirectUrl = role === 'admin' ? '/admin/dashboard' : (role === 'customer' ? '/app/dashboard' : '/dashboard');

    const response = NextResponse.json({
      success: true,
      message: `Access granted as ${role === 'admin' ? 'Super Executive Admin' : role === 'customer' ? 'Customer' : 'Staff Operator'}`,
      role,
      userName,
      userId,
      isGlobalUser,
      mustChangePassword,
      redirectUrl,
      sessionId: session.id,
      ipAddress: geo.ip,
      location,
      isp: geo.isp,
      deviceName: clientDeviceName,
    });

    // Set secure authentication cookies
    const cookieOptions = {
      httpOnly: false, // Accessible to client-side scripts
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    };

    const signedToken = signSession({
      userId,
      role: role as any,
      email: targetIdentifier || (role === 'admin' ? 'sameer.centric@gmail.com' : role === 'customer' ? 'client@gmail.com' : 'staff@samvero.com'),
      name: userName,
      isGlobal: isGlobalUser,
      sessionId: session.id,
      timestamp: Date.now(),
    });

    response.cookies.set({
      name: 'samvero_portal_token',
      value: signedToken,
      ...cookieOptions,
    });

    response.cookies.set({
      name: 'samvero_portal_role',
      value: role,
      ...cookieOptions,
    });

    response.cookies.set({
      name: 'samvero_user_id',
      value: userId,
      ...cookieOptions,
    });

    response.cookies.set({
      name: 'samvero_is_global',
      value: isGlobalUser ? 'true' : 'false',
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
    const verifiedSession = verifySessionToken(token);

    const isAuthenticated = Boolean(verifiedSession);
    const role = verifiedSession ? verifiedSession.role : null;
    const userId = verifiedSession ? verifiedSession.userId : null;
    const userName = verifiedSession ? verifiedSession.name : null;
    const isGlobalUser = verifiedSession ? verifiedSession.isGlobal : false;
    const sessionId = verifiedSession ? verifiedSession.sessionId : '';

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
      role: isAuthenticated ? (role === 'super_admin' ? 'admin' : role) : null,
      userId: isAuthenticated ? userId : null,
      isGlobalUser: isAuthenticated ? isGlobalUser : false,
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
