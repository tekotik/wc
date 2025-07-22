
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useSession } from '@/hooks/use-session';
import type { User } from '@supabase/supabase-js';

// Extend the user_metadata type to include our custom fields
interface AppUserMetadata {
    name?: string;
    balance?: number;
}

// Extend the Supabase User type
interface AppUser extends User {
    user_metadata: AppUserMetadata;
}


interface AuthContextType {
  user: AppUser | null;
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
      // User from useSession is already the correct type with metadata
      const appUser = user as AppUser;
      const userBalance = appUser.user_metadata?.balance ?? 0;
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
    <AuthContext.Provider value={{ user: user as AppUser, loading: isLoading, balance, setBalance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
