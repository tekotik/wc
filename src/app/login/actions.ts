
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
    const rawFormData = Object.fromEntries(formData);
    
    const { login, password } = rawFormData as { login: string, password: string };

    // 1. Check if it's an admin
    const admin = await getAdminByEmail(login);
    if (admin) {
        const passwordsMatch = password === admin.password;
        if (passwordsMatch) {
            const session = await getSession();
            session.userId = admin.id;
            session.isLoggedIn = true;
            session.userRole = 'admin';
            await session.save();
            redirect('/admin');
        }
    }
    
    // 2. If not admin, proceed with standard validation and user check
    const validatedFields = loginSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Пожалуйста, исправьте ошибки в форме.",
        };
    }
    
    const { login: validatedLogin, password: validatedPassword } = validatedFields.data;
    
    // Check if the login is for a regular user (assuming email is used as login for users)
    const user = await getUser(validatedLogin);
    if (user) {
        const passwordsMatch = await verifyPassword(validatedPassword, user.password);
        if (passwordsMatch) {
            const session = await getSession();
            session.userId = user.id;
            session.isLoggedIn = true;
            session.userRole = 'user';
            await session.save();
            redirect('/dashboard');
        }
    }

    // 3. If neither, return error
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
