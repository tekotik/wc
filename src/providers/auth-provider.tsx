
"use client";

import { createContext, useContext, useState } from 'react';
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
  const [balance, setBalance] = useState(user?.balance ?? 0);

  // Sync balance when user data changes
  useState(() => {
    if(user?.balance) {
      setBalance(user.balance);
    }
  });
  
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
