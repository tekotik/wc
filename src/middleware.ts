
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await getIronSession<SessionData>(request.cookies, sessionOptions);
  const { isLoggedIn, userRole } = session;

  const isAuthRoute = ['/login', '/signup'].includes(pathname);
  const isAdminRoute = pathname.startsWith('/admin');

  // If user is logged in
  if (isLoggedIn) {
    // If they are on an auth route, redirect to the appropriate dashboard
    if (isAuthRoute || pathname === '/') {
      if (userRole === 'admin') {
         return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // If a non-admin user tries to access admin routes, redirect them
    if (isAdminRoute && userRole !== 'admin') {
       return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } 
  // If user is not logged in
  else {
    const isProtectedRoute = !isAuthRoute && pathname !== '/' && !pathname.startsWith('/c/');
    // And trying to access a protected route, redirect to login
    if (isProtectedRoute) {
       console.log(`[Middleware] Unauthorized access to ${pathname}, redirecting to login.`);
       return NextResponse.redirect(new URL('/login', request.url));
    }
  }

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
