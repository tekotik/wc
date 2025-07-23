
'use server';

import 'server-only';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { getUser, verifyPassword, getAdminByEmail } from '@/lib/user-service';
import { getSession } from '@/lib/session';


const loginSchema = z.object({
  email: z.string().min(1, { message: "Логин не может быть пустым."}),
  password: z.string().min(1, { message: "Пароль не может быть пустым." }),
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
    
    const { email, password } = rawFormData as { email: string, password: string };

    // 1. Check if it's an admin (special case, bypasses Zod for password length etc.)
    const admin = await getAdminByEmail(email);
    if (admin) {
        // For manually added admins in CSV, we do a direct password check.
        const passwordsMatch = password === admin.password;
        if (passwordsMatch) {
            console.log("[Login Action] Admin login successful. Creating admin session.");
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
        console.error("[Login Action] Form validation failed:", validatedFields.error.flatten().fieldErrors);
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Пожалуйста, исправьте ошибки в форме.",
        };
    }
    
    const { email: validatedEmail, password: validatedPassword } = validatedFields.data;
    
    const user = await getUser(validatedEmail);
    if (user) {
        const passwordsMatch = await verifyPassword(validatedPassword, user.password);
        if (passwordsMatch) {
            console.log("[Login Action] User login successful. Creating user session.");
            const session = await getSession();
            session.userId = user.id;
            session.isLoggedIn = true;
            session.userRole = 'user';
            await session.save();
            redirect('/dashboard');
        }
    }

    // 3. If neither, return error
    console.warn("[Login Action] User or admin not found, or password incorrect for:", email);
    return {
        success: false,
        message: "Неверный логин или пароль.",
        errors: { server: "Неверный логин или пароль."}
    }
}

export async function logoutAction() {
    console.log("[Logout Action] Started.");
    const session = await getSession();
    session.destroy();
    console.log("[Logout Action] Session destroyed. Redirecting to /login.");
    redirect('/login');
}
