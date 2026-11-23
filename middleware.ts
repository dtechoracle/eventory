import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'eventory-nexus-default-super-secret-key-32charsmin'
);

const AUTH_COOKIE_NAME = 'eventory_session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let session: { userId: string; email: string; role: string; name: string } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      session = payload as any;
    } catch {
      // Invalid or expired token
      session = null;
    }
  }

  // 1. Protected routes: /dashboard/:path*
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      // Clear invalid cookie if present
      if (token) {
        response.cookies.delete(AUTH_COOKIE_NAME);
      }
      return response;
    }

    // Role-based route guard:
    // If a vendor tries to access /dashboard/events (or other creator routes), allow or route to /dashboard/vendor
    // If a creator tries to access /dashboard/vendor, allow or route to /dashboard/events
    return NextResponse.next();
  }

  // 2. Auth routes: /login and /signup
  if (pathname === '/login' || pathname === '/signup') {
    if (session) {
      // User is already authenticated, redirect to appropriate dashboard
      const target = session.role === 'vendor' ? '/dashboard/vendor' : '/dashboard/events';
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};
