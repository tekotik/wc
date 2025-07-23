
'use server';

import 'server-only';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { getUser, verifyPassword } from '@/lib/user-service';
import { getSession } from '@/lib/session';


const loginSchema = z.object({
  email: z.string().email({ message: "Неверный формат email." }),
  password: z.string().min(6, { message: "Пароль должен содержать не менее 6 символов." }),
});

export type LoginFormState = {
    message: string;
    errors?: {
        email?: string[];
        password?: string[];
        server?: string;
    };
    success: boolean;
}

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
    console.log("[Login Action] Started.");
    const rawFormData = Object.fromEntries(formData);

    // Special case for admin login, checked BEFORE validation
    if (rawFormData.email === 'admin@admin.com' && rawFormData.password === 'admin@admin.com') {
        console.log("[Login Action] Admin login successful. Creating admin session.");
        const session = await getSession();
        session.userId = 'admin_user';
        session.isLoggedIn = true;
        session.userRole = 'admin';
        await session.save();
        redirect('/admin');
    }

    const validatedFields = loginSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        console.error("[Login Action] Form validation failed:", validatedFields.error.flatten().fieldErrors);
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Пожалуйста, исправьте ошибки в форме.",
        };
    }
    
    const { email, password } = validatedFields.data;
    console.log("[Login Action] Attempting login for:", email);

    const user = await getUser(email);

    if (!user) {
        console.warn("[Login Action] User not found for email:", email);
        return {
            success: false,
            message: "Пользователь с таким email не найден.",
            errors: { server: "Пользователь не найден."}
        }
    }
    console.log("[Login Action] User found:", user.id);

    const passwordsMatch = await verifyPassword(password, user.password);

    if (!passwordsMatch) {
         console.warn("[Login Action] Incorrect password for user:", user.id);
         return {
            success: false,
            message: "Неверный пароль.",
            errors: { server: "Неверный пароль."}
        }
    }
    
    console.log("[Login Action] Password verified for user:", user.id, ". Creating session.");
    
    const session = await getSession();
    session.userId = user.id;
    session.isLoggedIn = true;
    session.userRole = user.role;
    await session.save();

    console.log("[Login Action] Session saved. Redirecting to dashboard.");
    redirect('/dashboard');
}

export async function logoutAction() {
    console.log("[Logout Action] Started.");
    const session = await getSession();
    session.destroy();
    console.log("[Logout Action] Session destroyed. Redirecting to /login.");
    redirect('/login');
}
