
'use client';

import { useEffect, useState } from "react";

// This is a mock user. In a real app, you'd get this from your session management.
const mockUser = {
    id: '1',
    email: 'test@example.com',
    user_metadata: {
        name: 'Тестовый Пользователь',
        balance: 1000
    }
};


export function useSession() {
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate an async session fetch
        const timer = setTimeout(() => {
            setUser(mockUser);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return { user, isLoading };
}
