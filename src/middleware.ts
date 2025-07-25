
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getIronSession<SessionData>(request.cookies, sessionOptions);
  const { isLoggedIn, userRole } = session;

  // Define public routes that don't require authentication
  const isPublicRoute = 
    pathname === '/' || // The landing page is now public at the root
    pathname === '/login' || 
    pathname === '/signup' ||
    pathname.startsWith('/c/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.'); // Assets like images, icons, etc.

  // If the user is logged in
  if (isLoggedIn) {
    // and tries to access login/signup page, redirect them based on role
    if (pathname === '/login' || pathname === '/signup') {
        const redirectUrl = userRole === 'admin' ? '/admin' : '/dashboard';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    // and is an admin trying to access a user page, redirect to admin page
    if (userRole === 'admin' && (pathname.startsWith('/dashboard') || pathname.startsWith('/campaigns') || pathname.startsWith('/analytics') || pathname.startsWith('/replies'))){
         return NextResponse.redirect(new URL('/admin', request.url));
    }
    // and is a user trying to access an admin page, redirect to dashboard
    if (userRole === 'user' && pathname.startsWith('/admin')) {
         return NextResponse.redirect(new URL('/dashboard', request.url));
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

    