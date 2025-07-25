
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // refreshing the auth session
  // const { data: { user } } = await supabase.auth.getUser(); // Закомментировано
  // const { pathname } = request.nextUrl; // Закомментировано

  // const protectedRoutes = ['/dashboard', '/campaigns', '/analytics', '/admin', '/replies', '/in-progress']; // Закомментировано
  // const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route)); // Закомментировано

  // if (!user && isProtectedRoute) { // Закомментировано
  //   const url = request.nextUrl.clone(); // Закомментировано
  //   url.pathname = '/login'; // Закомментировано
  //   return NextResponse.redirect(url); // Закомментировано
  // } // Закомментировано

  //  if (user && (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname === '/')) { // Закомментировано
  //   const url = request.nextUrl.clone(); // Закомментировано
  //   url.pathname = '/dashboard'; // Закомментировано
  //   return NextResponse.redirect(url); // Закомментировано
  // } // Закомментировано

  return supabaseResponse;
}
