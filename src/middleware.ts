
import { type NextRequest, NextResponse } from 'next/server';

// This is a simplified middleware. In a real app, you would verify a session cookie.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Assume a user is logged in for simplicity. 
  // A real implementation would check for a valid session cookie.
  const isAuthenticated = true; 

  const protectedRoutes = ['/dashboard', '/campaigns', '/analytics', '/admin', '/replies', '/in-progress'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (!isAuthenticated && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

   if (isAuthenticated && (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname === '/')) {
    // Allow access to the landing page even if "authenticated"
    if (pathname === '/') return NextResponse.next();
    
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

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
