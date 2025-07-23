
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getIronSession<SessionData>(request.cookies, sessionOptions);
  const { isLoggedIn, userRole } = session;

  const isPublicApiOrAsset = 
    pathname.startsWith('/api/') || 
    pathname.includes('.') || // Matches files with extensions (e.g., favicon.ico, logo.svg)
    pathname.startsWith('/_next') || 
    pathname.startsWith('/c/');
    
  const isPublicLanding = pathname === '/';
  const isAuthRoute = pathname === '/login' || pathname === '/signup';
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/in-progress');
  const isUserDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/campaigns') || pathname.startsWith('/analytics') || pathname.startsWith('/replies');

  // Allow all truly public assets and pages to pass through without checks
  if (isPublicApiOrAsset || isPublicLanding) {
      return NextResponse.next();
  }

  // --- Rule 1: Handle users who are NOT logged in ---
  if (!isLoggedIn) {
    // If not logged in, only allow access to auth routes
    if (isAuthRoute) {
      return NextResponse.next();
    }
    // For any other route, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // --- At this point, the user IS logged in. ---
  
  // --- Rule 2: Handle ADMIN users ---
  if (userRole === 'admin') {
    // If admin is on an auth route, redirect to their main page
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // If admin tries to access a user-specific page, redirect them back to their main page
    if (isUserDashboardRoute) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Otherwise, allow access to their designated routes
    if (isAdminRoute) {
        return NextResponse.next();
    }
    // Fallback for any other unexpected route
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // --- Rule 3: Handle regular USERS ---
  if (userRole === 'user') {
    // If user is logged in and tries to access an auth route, redirect to their dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // If user tries to access an admin route, block them by redirecting to their dashboard
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // For any other case (e.g., user is on their dashboard), allow the request to proceed.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * We will handle API routes and other assets inside the middleware itself.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
