
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getIronSession<SessionData>(request.cookies, sessionOptions);
  const { isLoggedIn, userRole } = session;

  const isAuthRoute = ['/login', '/signup'].includes(pathname);
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/in-progress');

  // If user is not logged in, redirect to login for any protected route
  if (!isLoggedIn) {
    const isPublicRoute = isAuthRoute || pathname === '/' || pathname.startsWith('/c/');
    if (!isPublicRoute) {
      console.log(`[Middleware] Unauthorized access to ${pathname}, redirecting to login.`);
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // --- At this point, user is logged in ---

  // If a logged in user tries to access login/signup/landing pages
  if (isAuthRoute || pathname === '/') {
    const destination = userRole === 'admin' ? '/admin' : '/dashboard';
    console.log(`[Middleware] Logged in user on auth route, redirecting to ${destination}.`);
    return NextResponse.redirect(new URL(destination, request.url));
  }
  
  // If a non-admin user tries to access admin-only routes
  if (isAdminRoute && userRole !== 'admin') {
    console.log(`[Middleware] Non-admin user trying to access ${pathname}, redirecting to dashboard.`);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // All other cases are allowed (admin on admin routes, user on user routes)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * This ensures the middleware runs only on pages and not on static assets or API endpoints.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
