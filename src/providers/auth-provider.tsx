
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

// A mock to simulate fetching session data. In a real app this might be an API call.
async function getSessionData() {
    const res = await fetch('/api/session', { cache: 'no-store' }); // Disable cache
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
    const publicRoutes = ['/', '/login', '/signup'];
     if (publicRoutes.includes(pathname) || pathname.startsWith('/c/')) {
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
        const data = await getSessionData();
        
        let finalUser: User | null = null;
        // This is the critical fix. We forcefully create the admin user object
        // to ensure its role is correctly identified throughout the app.
        if (data.isLoggedIn && data.user?.id === 'admin_user') {
             finalUser = {
                id: 'admin_user',
                name: 'Admin',
                email: 'admin@admin.com',
                role: 'admin'
            };
        } else {
            finalUser = data.user;
        }

        setUser(finalUser);
        setBalance(data.balance ?? 0);
        setIsLoggedIn(data.isLoggedIn);

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
  
  if (loading) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin" />
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
