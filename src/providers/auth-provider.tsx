
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useSession } from '@/hooks/use-session';

// This is a mock User type.
type User = {
    id: string;
    email: string;
    user_metadata: {
        name: string;
        balance?: number;
    }
}

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
      // In a real app, this data would come from your DB.
      const userBalance = user.user_metadata?.balance ?? 15300;
      setBalance(userBalance);
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
