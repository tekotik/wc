
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/lib/user-service';
import { Loader2 } from 'lucide-react';
import { useSession } from '@/hooks/use-session';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  balance: 0,
  setBalance: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useSession();
  const [balance, setBalance] = useState(0);

  // Sync balance when user data changes
  useEffect(() => {
    if (user) {
      // In a real app, the user object from the session would have the balance.
      // For the mock, we can set a default or use the one from the user object.
      setBalance(user.balance || 15300);
    }
  }, [user]);
  
  if (isLoading) {
     return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading: isLoading, balance, setBalance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
