
'use server';

import 'server-only';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { getUser, verifyPassword, getAdminByEmail } from '@/lib/user-service';
import { getSession } from '@/lib/session';

export type LoginFormState = {
    message: string;
    errors?: {
        server?: string;
    };
    success: boolean;
}

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
    const login = formData.get('login') as string;
    const password = formData.get('password') as string;

    if (!login || !password) {
        return {
            success: false,
            message: "Логин и пароль не могут быть пустыми.",
        };
    }

    try {
        // 1. Check if it's an admin
        const admin = await getAdminByEmail(login);
        if (admin) {
            const passwordsMatch = (password === admin.password);
            if (passwordsMatch) {
                const session = await getSession();
                session.userId = admin.id;
                session.isLoggedIn = true;
                session.userRole = 'admin';
                await session.save();
                // We redirect from the action itself upon success
                return redirect('/admin');
            }
        }
        
        // 2. If not admin, check for a regular user
        const user = await getUser(login);
        if (user) {
            const passwordsMatch = await verifyPassword(password, user.password);
            if (passwordsMatch) {
                const session = await getSession();
                session.userId = user.id;
                session.isLoggedIn = true;
                session.userRole = 'user';
                await session.save();
                // Redirect from the action
                return redirect('/dashboard');
            }
        }

        // 3. If neither matches, return error
        return {
            success: false,
            message: "Неверный логин или пароль.",
        };
    } catch (error) {
        console.error("Login action error:", error);
        return {
            success: false,
            message: "Произошла непредвиденная ошибка на сервере.",
        };
    }
}

export async function logoutAction() {
    const session = await getSession();
    session.destroy();
    redirect('/login');
}
