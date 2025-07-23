
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getIronSession<SessionData>(request.cookies, sessionOptions);
  const { isLoggedIn, userRole } = session;

  const isAuthRoute = pathname === '/login' || pathname === '/signup';
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/in-progress');
  const isPublicApiOrAsset = pathname.startsWith('/api/') || pathname.includes('.') || pathname.startsWith('/_next') || pathname.startsWith('/c/');
  const isPublicLanding = pathname === '/';

  // Allow all public assets, API routes, and special public pages to pass through
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
    // If admin is on an auth route, redirect to admin home
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // If admin tries to access a non-admin route, redirect to admin home
    if (!isAdminRoute) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Otherwise, allow access to admin routes
    return NextResponse.next();
  }

  // --- Rule 3: Handle regular USERS ---
  if (userRole === 'user') {
    // If user is on an auth route, redirect to user dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // If user tries to access an admin route, redirect to user dashboard
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
