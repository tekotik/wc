
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getIronSession<SessionData>(request.cookies, sessionOptions);
  const { isLoggedIn, userRole } = session;

  const isAuthRoute = pathname === '/login' || pathname === '/signup';
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/in-progress');
  const isPublicApiRoute = pathname.startsWith('/c/'); // Public link for clients

  // --- Rule 1: Handle users who are NOT logged in ---
  if (!isLoggedIn) {
    const isPublicRoute = isAuthRoute || pathname === '/' || isPublicApiRoute;
    if (isPublicRoute) {
      return NextResponse.next(); // Allow access to public and auth routes
    }
    // For any other route, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // --- At this point, the user IS logged in. ---
  
  // --- Rule 2: Handle ADMIN users ---
  if (userRole === 'admin') {
    // If admin is on an auth route, redirect to admin home
    if (isAuthRoute || pathname === '/') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // If admin is on an admin route, allow them
    if (isAdminRoute) {
      return NextResponse.next();
    }
    // If admin is on ANY OTHER route (e.g., user dashboard), redirect to admin home
    if (!isPublicApiRoute) { // Allow admins to view client links
        return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // --- Rule 3: Handle regular USERS ---
  if (userRole === 'user') {
    // If user is on an auth route, redirect to user dashboard
    if (isAuthRoute || pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // If user tries to access an admin route, redirect to user dashboard
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // For any other case, allow the request to proceed.
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
