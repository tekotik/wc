
'use client';

import { useEffect, useState } from "react";
import type { User } from "@/lib/user-service";
import { getSessionUser } from "@/app/login/actions";
import { usePathname } from "next/navigation";

export function useSession() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        const fetchSession = async () => {
            // No need to set loading to true on every path change, only on initial load.
            // This prevents flashes of the loading indicator on normal navigation.
            try {
                const sessionUser = await getSessionUser();
                setUser(sessionUser);
            } catch (e) {
                console.error("Failed to fetch session", e);
                setUser(null);
            } finally {
                // Only set loading to false after the first fetch
                if (isLoading) {
                    setIsLoading(false);
                }
            }
        };

        fetchSession();
    // We only want to re-run this when the pathname changes to reflect login/logout actions.
    }, [pathname]);

    return { user, isLoading };
}
