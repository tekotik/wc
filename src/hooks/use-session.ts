
'use client';

import { useEffect, useState } from "react";
import type { User } from "@/lib/user-service";
import { getSessionUser } from "@/app/login/actions";
import { usePathname } from "next/navigation";

export function useSession() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const fetchSession = async () => {
            setIsLoading(true);
            try {
                const sessionUser = await getSessionUser();
                setUser(sessionUser);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Failed to fetch session');
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSession();
    }, [pathname]); // Refetch session on route change

    return { user, isLoading, error };
}
