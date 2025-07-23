import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the session from the request cookies
  const session = await getIronSession<SessionData>(request.cookies, sessionOptions);
  const { isLoggedIn } = session;

  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/campaigns', '/analytics', '/replies', '/in-progress'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Define routes for authenticated users to be redirected away from
  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Define public routes that are always accessible
  const publicRoutes = ['/'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // If the user is not logged in and trying to access a protected route, redirect to login
  if (!isLoggedIn && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If the user is logged in and trying to access an auth route (login/signup), redirect to dashboard
  if (isLoggedIn && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
  
  // If the user is not logged in and tries to access the root, redirect to the landing page
  if (!isLoggedIn && pathname === '/') {
     return NextResponse.next();
  }

  // If the user IS logged in and tries to access the root landing page, redirect to dashboard
  if (isLoggedIn && pathname === '/') {
     const url = request.nextUrl.clone();
     url.pathname = '/dashboard';
     return NextResponse.redirect(url);
  }


  // Otherwise, continue to the requested page
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
