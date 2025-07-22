
import { NextResponse, type NextRequest } from 'next/server';

// This is a simplified middleware. In a real app, you'd check for a valid session cookie.
// For this mock version, we'll just check for a "logged_in" cookie for demonstration.

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.get('auth_session'); // Example cookie

  const protectedRoutes = ['/dashboard', '/campaigns', '/analytics', '/admin', '/replies', '/in-progress'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // A real implementation would be more robust.
  // This is a placeholder to demonstrate route protection.
  // For now, we will allow access to all routes as we don't have a full auth system.
  // You can replace this with your actual authentication logic.

  // if (!isLoggedIn && isProtectedRoute) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/login';
  //   return NextResponse.redirect(url);
  // }

  // if (isLoggedIn && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/dashboard';
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
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
