
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

async function getSessionData() {
    const res = await fetch('/api/session', { cache: 'no-store' });
    if (res.ok) {
        return res.json();
    }
    return { isLoggedIn: false, user: null, balance: 0 };
}

interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  balance: 0,
  setBalance: () => {},
  isLoggedIn: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const pathname = usePathname();

  const fetchSession = useCallback(async () => {
    setLoading(true);
    try {
        const data = await getSessionData();

        if (data.isLoggedIn && data.user) {
             let finalUser = data.user;
             // Force correct role for admin user to avoid client/server mismatches
             if (data.user.id === 'admin_user') {
                finalUser = { ...data.user, role: 'admin' };
             }
             setUser(finalUser);
             setIsLoggedIn(true);
        } else {
            setUser(null);
            setIsLoggedIn(false);
        }
        setBalance(data.balance ?? 0);
    } catch (error) {
        console.error("Failed to fetch session", error);
        setUser(null);
        setIsLoggedIn(false);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession, pathname]); // Re-fetch on path change to ensure consistency
  
  const publicRoutes = ['/', '/login', '/signup'];
  const isPublicPage = publicRoutes.includes(pathname) || pathname.startsWith('/c/') || pathname.startsWith('/api/');

  if (loading && !isPublicPage) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  // If on a public page, don't block rendering, just provide the context
  if (isPublicPage) {
     return (
        <AuthContext.Provider value={{ user, loading, balance, setBalance, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
     )
  }

  // For protected pages, if not logged in and not loading, children won't be rendered
  // The middleware should have already redirected, but this is a fallback.
  return (
    <AuthContext.Provider value={{ user, loading, balance, setBalance, isLoggedIn }}>
      {!loading && isLoggedIn ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
