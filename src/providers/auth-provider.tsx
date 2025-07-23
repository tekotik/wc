
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// A mock to simulate fetching session data. In a real app this might be an API call.
async function getSessionData() {
    const res = await fetch('/api/session');
    if (res.ok) {
        return res.json();
    }
    return { isLoggedIn: false, user: null, balance: 0 };
}

interface User {
    id: string;
    name: string;
    email: string;
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

  useEffect(() => {
    const fetchSession = async () => {
        try {
            const data = await getSessionData();
            setUser(data.user);
            setBalance(data.balance ?? 0);
            setIsLoggedIn(data.isLoggedIn);
        } catch (error) {
            console.error("Failed to fetch session", error);
            setUser(null);
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };
    fetchSession();
  }, []);
  
  if (loading) {
     return (
        <div className="flex h-screen w-full items-center justify-center">
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
