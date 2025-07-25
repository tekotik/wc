
'use server';

import 'server-only';
import { z } from 'zod';
import { getUser, verifyPassword, getAdminByEmail } from '@/lib/user-service';
import { getSession } from '@/lib/session';

export type LoginFormState = {
    message: string;
    success: boolean;
    redirectUrl?: string;
}

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
    // Correctly extract form data
    const data = Object.fromEntries(formData.entries());
    const login = data.login as string;
    const password = data.password as string;

    if (!login || !password) {
        return {
            success: false,
            message: "Логин и пароль не могут быть пустыми.",
        };
    }

    try {
        // First, check if it's an admin
        const admin = await getAdminByEmail(login);
        if (admin) {
            const passwordsMatch = await verifyPassword(password, admin.password);
            if (passwordsMatch) {
                const session = await getSession();
                session.userId = admin.id;
                session.isLoggedIn = true;
                session.userRole = 'admin';
                await session.save();
                return { success: true, message: 'Успешный вход!', redirectUrl: '/admin' };
            } else {
                 // Found admin by email, but password was wrong.
                 return { success: false, message: "Неверный логин или пароль." };
            }
        }
        
        // If not an admin, check if it's a regular user
        const user = await getUser(login);
        if (user) {
            const passwordsMatch = await verifyPassword(password, user.password);
            if (passwordsMatch) {
                const session = await getSession();
                session.userId = user.id;
                session.isLoggedIn = true;
                session.userRole = 'user';
                await session.save();
                return { success: true, message: 'Успешный вход!', redirectUrl: '/dashboard' };
            }
        }

        // If neither user nor admin found with this login, or password was wrong for the user
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
    const { redirect } = await import('next/navigation');
    const session = await getSession();
    await session.destroy();
    redirect('/login');
}
