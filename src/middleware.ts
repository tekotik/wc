
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getIronSession<SessionData>(request.cookies, sessionOptions);
  const { isLoggedIn, userRole } = session;

  const isAuthRoute = ['/login', '/signup'].includes(pathname);
  const isAdminOnlyRoute = pathname.startsWith('/admin') || pathname.startsWith('/in-progress');

  // If user is not logged in, redirect to login for any protected route
  if (!isLoggedIn) {
    const isPublicRoute = isAuthRoute || pathname === '/' || pathname.startsWith('/c/');
    if (!isPublicRoute) {
      console.log(`[Middleware] Unauthorized access to ${pathname}, redirecting to login.`);
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // If user is logged in
  if (isAuthRoute || pathname === '/') {
    const destination = userRole === 'admin' ? '/in-progress' : '/dashboard';
    console.log(`[Middleware] Logged in user on auth route, redirecting to ${destination}.`);
    return NextResponse.redirect(new URL(destination, request.url));
  }
  
  // If a non-admin tries to access admin routes, redirect to their dashboard
  if (isAdminOnlyRoute && userRole !== 'admin') {
    console.log(`[Middleware] Non-admin user trying to access ${pathname}, redirecting to dashboard.`);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (pathname === '/admin' && userRole === 'admin') {
    return NextResponse.redirect(new URL('/in-progress', request.url));
  }
  
  if (userRole === 'admin' && !isAdminOnlyRoute && pathname !== '/in-progress') {
     console.log(`[Middleware] Admin on non-admin page ${pathname}, allowing access.`);
     // To prevent redirection loop and allow access to other pages for admin if needed in future
  }


  // All other cases for logged-in users are allowed
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
