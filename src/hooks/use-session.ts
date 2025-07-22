
'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// This is a mock User type, replace with your actual User type
type User = {
    id: string;
    email: string;
    user_metadata: {
        name: string;
        balance?: number;
    }
}

// This is a mock session hook. In a real app, you would check for a session cookie
// and fetch user data from your API.
export function useSession() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        // Simulate an async check for a user session
        const checkSession = () => {
             // In a real app, you'd decode a JWT or call an API endpoint.
             // For this mock, we'll create a fake user after a short delay
             // to simulate a network request.
             setTimeout(() => {
                // If we are on login/signup pages, don't set a user.
                if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
                    setUser(null);
                } else {
                    setUser({
                        id: 'mock-user-123',
                        email: 'test@example.com',
                        user_metadata: {
                            name: 'Тестовый Пользователь',
                            balance: 15300
                        }
                    });
                }
                setIsLoading(false);
             }, 500);
        };

        checkSession();
    }, [pathname]);

    return { user, isLoading };
}
