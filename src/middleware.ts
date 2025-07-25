

import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getIronSession<SessionData>(request.cookies, sessionOptions);
  const { isLoggedIn, userRole } = session;

  const isPublicRoute = 
    pathname === '/' || // The landing page is now public
    pathname === '/login' || 
    pathname === '/signup' ||
    pathname.startsWith('/c/') ||
    pathname.startsWith('/api/') || // API routes are public
    pathname.includes('.'); // Assets (like favicon.ico)

  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  // If the user is logged in
  if (isLoggedIn) {
    // and tries to access login/signup, redirect them to their dashboard
    if (isAuthRoute) {
        const redirectUrl = userRole === 'admin' ? '/admin' : '/dashboard';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    // and is a regular user trying to access an admin page, redirect to their dashboard
    if (userRole === 'user' && pathname.startsWith('/admin')) {
         return NextResponse.redirect(new URL('/dashboard', request.url));
    }
     // and is an admin trying to access a user dashboard, redirect to admin page
    if (userRole === 'admin' && pathname.startsWith('/dashboard')){
         return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // If the user is NOT logged in and trying to access a protected route
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except for static files and _next
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
