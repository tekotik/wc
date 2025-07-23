
'use server';

import 'server-only';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { getUser, verifyPassword, getAdminByEmail } from '@/lib/user-service';
import { getSession } from '@/lib/session';


const loginSchema = z.object({
  login: z.string().min(1, { message: "Логин не может быть пустым."}),
  password: z.string().min(1, { message: "Пароль не может быть пустым." }),
});

export type LoginFormState = {
    message: string;
    errors?: {
        login?: string[];
        password?: string[];
        server?: string;
    };
    success: boolean;
}

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
    // Correctly get form data by name
    const login = formData.get('login') as string;
    const password = formData.get('password') as string;

    if (!login || !password) {
        return {
            success: false,
            message: "Логин и пароль не могут быть пустыми.",
        }
    }

    // 1. Check if it's an admin
    const admin = await getAdminByEmail(login);
    if (admin) {
        // Direct password comparison for manually added admins.
        const passwordsMatch = (password === admin.password);
        if (passwordsMatch) {
            const session = await getSession();
            session.userId = admin.id;
            session.isLoggedIn = true;
            session.userRole = 'admin';
            await session.save();
            redirect('/admin');
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
            redirect('/dashboard');
        }
    }

    // 3. If neither admin nor user matches, return error
    return {
        success: false,
        message: "Неверный логин или пароль.",
        errors: { server: "Неверный логин или пароль."}
    }
}

export async function logoutAction() {
    const session = await getSession();
    session.destroy();
    redirect('/login');
}
