
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getIronSession<SessionData>(request.cookies, sessionOptions);
  const { isLoggedIn, userRole } = session;

  const isPublicRoute = 
    pathname === '/login' || 
    pathname === '/signup' ||
    pathname === '/landing' || // The landing page is now at /landing
    pathname.startsWith('/c/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.'); // Assets

  // If the user is logged in
  if (isLoggedIn) {
    // and tries to access login/signup/landing page, redirect them based on role
    if (pathname === '/login' || pathname === '/signup' || pathname === '/landing') {
        const redirectUrl = userRole === 'admin' ? '/admin' : '/';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    // and is an admin trying to access a user page, redirect to admin page
    if (userRole === 'admin' && (pathname.startsWith('/dashboard') || pathname.startsWith('/campaigns') || pathname.startsWith('/analytics') || pathname.startsWith('/replies') || pathname === '/')){
         return NextResponse.redirect(new URL('/admin', request.url));
    }
    // and is a user trying to access an admin page, redirect to dashboard
    if (userRole === 'user' && pathname.startsWith('/admin')) {
         return NextResponse.redirect(new URL('/', request.url));
    }
    // Otherwise, allow the request
    return NextResponse.next();
  }

  // If the user is NOT logged in and trying to access a protected route
  if (!isLoggedIn && !isPublicRoute) {
    // Redirect them to the login page
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If not logged in and on a public route, allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
