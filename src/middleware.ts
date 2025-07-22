
import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

const protectedRoutes = ['/dashboard', '/campaigns', '/analytics', '/admin', '/replies', '/in-progress'];
const publicRoutes = ['/login', '/', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and image optimization
  if (pathname.startsWith('/api') || pathname.startsWith('/_next/static') || pathname.startsWith('/_next/image') || pathname.endsWith('.ico') || pathname.endsWith('.json')) {
    return NextResponse.next();
  }

  const session = await getSession();
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (!session?.user && isProtectedRoute) {
    // User is not logged in and tries to access a protected route
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect_to', pathname);
    return NextResponse.redirect(url);
  }

  if (session?.user && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
      // User is logged in and tries to access login or signup page
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
