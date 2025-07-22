
'use client';

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createBrowserClient } from "@/lib/supabase/client";
import { usePathname } from "next/navigation";

export function useSession() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
    const supabase = createBrowserClient();

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
          }
        );

        return () => {
          authListener.subscription.unsubscribe();
        };
    }, [pathname, supabase.auth]);

    return { user, isLoading };
}
