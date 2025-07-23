
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

async function getSessionData() {
    // Fetch with no-cache to ensure we always get the latest session state
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
    // Don't re-fetch on public pages to avoid unnecessary requests
    const isPublicPage = ['/login', '/signup', '/'].includes(pathname) || pathname.startsWith('/c/');
    if (isPublicPage) {
        setLoading(false);
        return;
    }
    
    setLoading(true);
    try {
        const data = await getSessionData();
        setUser(data.user || null);
        setIsLoggedIn(data.isLoggedIn || false);
        setBalance(data.balance ?? 0);
    } catch (error) {
        console.error("Failed to fetch session", error);
        setUser(null);
        setIsLoggedIn(false);
    } finally {
        setLoading(false);
    }
  }, [pathname]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);
  
  // On protected pages, show a loader while checking the session
  const isAuthPage = ['/login', '/signup', '/'].includes(pathname);
  if (loading && !isAuthPage && !pathname.startsWith('/c/')) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, balance, setBalance, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
