
"use client";

import { createContext, useContext, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

const protectedRoutes = ['/dashboard', '/campaigns', '/analytics', '/admin', '/replies'];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return; // Do nothing while loading
    }

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // If user is not logged in and tries to access a protected route, redirect to login
    if (!user && isProtectedRoute) {
      router.push('/login');
    }

    // If user is logged in and tries to access the login page, redirect to dashboard
    if (user && pathname === '/login') {
      router.push('/dashboard');
    }

  }, [user, loading, router, pathname]);

  // To avoid flashing content, we can show a loader or nothing while checking auth state
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  if (loading && isProtectedRoute) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
