import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // We need to get the session to check if the user is authenticated
  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request.cookies, sessionOptions);
  const { isLoggedIn } = session;

  const protectedRoutes = ['/dashboard', '/campaigns', '/analytics', '/admin', '/replies', '/in-progress'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  console.log(`[Middleware] Path: ${pathname}, IsLoggedIn: ${isLoggedIn}, IsProtectedRoute: ${isProtectedRoute}`);

  if (!isLoggedIn && isProtectedRoute) {
    console.log(`[Middleware] Not logged in, redirecting from protected route to /login`);
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

   if (isLoggedIn && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    console.log(`[Middleware] Logged in, redirecting from auth page to /dashboard`);
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
  
  // Allow access to landing page for everyone
  if (pathname === '/') {
    return NextResponse.next();
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
