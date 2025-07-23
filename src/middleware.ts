
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await getIronSession<SessionData>(request.cookies, sessionOptions);
  const { isLoggedIn } = session;

  const publicRoutes = ['/', '/login', '/signup', '/admin', '/logs'];
  const isAuthRoute = ['/login', '/signup'].includes(pathname);
  const isProtectedRoute = !publicRoutes.some(route => pathname.startsWith(route)) && pathname !== '/';

  // If user is logged in
  if (isLoggedIn) {
    // If they are on an auth route, redirect to dashboard
    if (isAuthRoute || pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } 
  // If user is not logged in
  else {
    // And trying to access a protected route, redirect to login
    if (isProtectedRoute) {
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
