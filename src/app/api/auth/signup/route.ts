import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllSaasUsers, 
  hashPassword, 
  ensureSaasStoreInitialized, 
  getAllPlans,
  SaasUser,
  SaasSubscription,
} from '@/lib/saas-store';
import { signSession } from '@/lib/session';
import { recordLoginSession } from '@/lib/audit-store';
import { getLivePublicIp, resolveIpDetails } from '@/lib/geo-ip';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, password, confirmPassword } = body;

    // 1. Validation
    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      return NextResponse.json(
        { success: false, error: 'Full name is required.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = fullName.trim();

    ensureSaasStoreInitialized();

    // 2. Duplicate Check
    const allUsers = getAllSaasUsers();
    const duplicate = allUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (duplicate) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists. Please log in.' },
        { status: 409 }
      );
    }

    // 3. Create User in SaaS Store
    const userId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const passwordHash = hashPassword(password);

    const newUser: SaasUser = {
      id: userId,
      email: trimmedEmail,
      name: trimmedName,
      country: 'Pakistan',
      role: 'customer',
      status: 'active',
      passwordHash,
      mustChangePassword: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add user and create initial subscription in db
    const dbPath = path.join(process.cwd(), 'data', 'saas-db.json');
    let db: any = { users: [], subscriptions: [], plans: [] };
    if (fs.existsSync(dbPath)) {
      try {
        db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      } catch (e) {}
    }
    if (!Array.isArray(db.users)) db.users = [];
    if (!Array.isArray(db.subscriptions)) db.subscriptions = [];

    db.users.push(newUser);

    // Initial 30-day active starter subscription
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    const availablePlans = getAllPlans();
    const starterPlan = availablePlans.find((p) => p.slug === 'starter' || p.id === 'plan_starter') || availablePlans[0];

    const starterSub: SaasSubscription = {
      id: `sub-${userId}`,
      customerId: userId,
      customerEmail: trimmedEmail,
      customerName: trimmedName,
      planId: starterPlan?.id || 'plan_starter',
      planName: starterPlan?.name || 'Starter Package',
      billingCycle: 'monthly',
      status: 'active',
      startDate: new Date().toISOString(),
      expiryDate: expiry.toISOString(),
      gracePeriodDays: 3,
      leadQuota: starterPlan?.maxLeadsQuota || 500,
      leadsConsumed: 0,
      renewalStatus: 'none',
      entitlements: (starterPlan || {}) as any,
      createdBy: 'Self Registration',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.subscriptions.push(starterSub);

    try {
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    } catch (err: any) {
      console.warn('[Signup] Could not persist db file:', err?.message);
    }

    // 4. Record session in audit history
    const cfIp = request.headers.get('cf-connecting-ip');
    const xForwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0].trim();
    const targetIp = cfIp || xForwardedFor || (await getLivePublicIp());
    const geo = await resolveIpDetails(targetIp);

    const session = recordLoginSession({
      role: 'customer',
      userName: trimmedName,
      ipAddress: geo.ip,
      deviceName: 'Web Browser (New Registration)',
      browser: 'Chrome',
      os: 'Desktop',
      location: `${geo.city}, ${geo.country}`,
      isp: geo.isp,
    });

    // 5. Sign Session Token
    const signedToken = signSession({
      userId,
      role: 'customer',
      email: trimmedEmail,
      name: trimmedName,
      isGlobal: false,
      sessionId: session.id,
      timestamp: Date.now(),
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully! Entering dashboard...',
      redirectUrl: '/dashboard',
      userId,
      role: 'customer',
      userName: trimmedName,
    });

    const cookieOptions = {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    };

    response.cookies.set({
      name: 'samvero_portal_token',
      value: signedToken,
      ...cookieOptions,
    });

    response.cookies.set({
      name: 'samvero_portal_role',
      value: 'customer',
      ...cookieOptions,
    });

    response.cookies.set({
      name: 'samvero_user_id',
      value: userId,
      ...cookieOptions,
    });

    response.cookies.set({
      name: 'samvero_portal_user',
      value: trimmedName,
      ...cookieOptions,
    });

    response.cookies.set({
      name: 'samvero_is_global',
      value: 'false',
      ...cookieOptions,
    });

    response.cookies.set({
      name: 'samvero_portal_session_id',
      value: session.id,
      ...cookieOptions,
    });

    return response;
  } catch (err: any) {
    console.error('Signup error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Server error occurred during account creation' },
      { status: 500 }
    );
  }
}
