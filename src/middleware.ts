import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('samvero_portal_token')?.value;
  const role = request.cookies.get('samvero_portal_role')?.value;

  const isAuthenticated = Boolean(token && (token.startsWith('samv_') || token.startsWith('auth_')));

  // 1. Protect Admin Routes: /admin/:path*
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role check: A customer MUST NEVER access admin routes
    if (role === 'customer') {
      return NextResponse.redirect(new URL('/app/dashboard', request.url));
    }

    if (role !== 'admin' && role !== 'super_admin') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect Customer App Routes: /app/:path*
  if (pathname.startsWith('/app')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Staff/Employer without customer/admin rights cannot access customer app
    if (role !== 'customer' && role !== 'admin' && role !== 'super_admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/app/:path*'],
};
