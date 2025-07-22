
import { NextResponse, type NextRequest } from 'next/server';

// This is a simplified middleware. In a real app, you'd check for a valid session cookie.
// For this mock version, we'll just check for a "logged_in" cookie for demonstration.

export async function middleware(request: NextRequest) {
  console.log('--- [Middleware Start] ---');
  try {
    const { pathname } = request.nextUrl;
    console.log(`[Middleware] Request received for path: ${pathname}`);

    // Check for a generic session cookie to simulate authentication
    const isLoggedIn = request.cookies.get('auth_session');

    if (isLoggedIn) {
      console.log('[Middleware] "auth_session" cookie found. User is considered logged in.');
    } else {
      console.log('[Middleware] "auth_session" cookie NOT found. User is considered logged out.');
    }
    
    const protectedRoutes = ['/dashboard', '/campaigns', '/analytics', '/admin', '/replies', '/in-progress'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute) {
        console.log(`[Middleware] Path "${pathname}" is a protected route.`);
    } else {
        console.log(`[Middleware] Path "${pathname}" is a public route.`);
    }

    // In a real implementation with full authentication, you would enable the following blocks.
    // For now, to ensure the app is stable and runs without a full auth backend, we'll allow access everywhere.
    // This logging helps see what *would* happen.

    // if (!isLoggedIn && isProtectedRoute) {
    //   const url = request.nextUrl.clone();
    //   url.pathname = '/login';
    //   console.log(`[Middleware] User is NOT logged in and trying to access a protected route. Redirecting to ${url.pathname}.`);
    //   console.log('--- [Middleware End] ---');
    //   return NextResponse.redirect(url);
    // }

    // if (isLoggedIn && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    //   const url = request.nextUrl.clone();
    //   url.pathname = '/dashboard';
    //   console.log(`[Middleware] User is logged in and trying to access login/signup page. Redirecting to ${url.pathname}.`);
    //   console.log('--- [Middleware End] ---');
    //   return NextResponse.redirect(url);
    // }

    console.log('[Middleware] Proceeding to next step in the chain.');
    console.log('--- [Middleware End] ---');
    return NextResponse.next();

  } catch(error) {
    console.error('[Middleware] CRITICAL ERROR! An unexpected error occurred in middleware:', error);
    // Return a response to prevent the request from hanging
    return new NextResponse(
      'An internal server error occurred in the middleware.',
      { status: 500 }
    );
  }
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
