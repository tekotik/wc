
'use server';

import 'server-only';
import { z } from 'zod';
import { findUserByEmail, verifyPassword } from '@/lib/user-service';
import { createSession, deleteSession, getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import type { User } from '@/lib/user-service';

const loginSchema = z.object({
  email: z.string().email({ message: "Неверный формат email." }),
  password: z.string().min(1, { message: "Пароль не может быть пустым." }),
});

export type LoginFormState = {
    message: string;
    errors?: {
        email?: string[];
        password?: string[];
    };
    success: boolean;
}

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
    const validatedFields = loginSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Пожалуйста, исправьте ошибки в форме.",
        };
    }

    const { email, password } = validatedFields.data;

    try {
        const user = await findUserByEmail(email);

        if (!user || !user.passwordHash) {
            return { success: false, message: "Неверный email или пароль." };
        }

        const passwordsMatch = await verifyPassword(password, user.passwordHash);

        if (!passwordsMatch) {
            return { success: false, message: "Неверный email или пароль." };
        }
        
        // Remove password hash from the user object before creating the session
        const { passwordHash, ...sessionUser } = user;

        await createSession(sessionUser);

    } catch (error) {
        console.error(error);
        const message = "Произошла внутренняя ошибка. Пожалуйста, попробуйте снова.";
        return { success: false, message };
    }

    redirect('/dashboard');
}


export async function getSessionUser(): Promise<User | null> {
    const session = await getSession();
    return session?.user ?? null;
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}
