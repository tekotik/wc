
import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

const protectedRoutes = ['/dashboard', '/campaigns', '/analytics', '/admin', '/replies', '/in-progress'];
const publicRoutes = ['/login', '/'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and image optimization
  if (pathname.startsWith('/api') || pathname.startsWith('/_next/static') || pathname.startsWith('/_next/image') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  const session = await getSession();
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If user is not logged in and tries to access a protected route
  if (!session?.user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user is logged in and tries to access login page
  if (session?.user && pathname === '/login') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * This ensures that internal Next.js requests for server actions are not blocked.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
