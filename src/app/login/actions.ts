
'use server';

import 'server-only';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getUser, verifyPassword } from '@/lib/user-service';


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
    console.log("Login action started.");
    const validatedFields = loginSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        console.error("Login form validation failed:", validatedFields.error.flatten().fieldErrors);
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Пожалуйста, исправьте ошибки в форме.",
        };
    }
    
    const { email, password } = validatedFields.data;
    console.log("Attempting login for:", email);

    const user = await getUser(email);

    if (!user) {
        console.warn("User not found for email:", email);
        return {
            success: false,
            message: "Пользователь с таким email не найден.",
            errors: { server: "Пользователь не найден."}
        }
    }
    console.log("User found:", user.id);

    const passwordsMatch = await verifyPassword(password, user.password);

    if (!passwordsMatch) {
         console.warn("Incorrect password for user:", user.id);
         return {
            success: false,
            message: "Неверный пароль.",
            errors: { server: "Неверный пароль."}
        }
    }
    
    console.log("Password verified for user:", user.id, ". Redirecting to dashboard.");
    // This is where you would typically set a session cookie.
    // For simplicity in this mock, we are just redirecting.
    // In a real app, you would use a library like next-auth or iron-session.
    
    revalidatePath('/', 'layout');
    redirect('/dashboard');
}

export async function logout() {
    // Here you would clear the session cookie
    console.log("Logging out and redirecting to /login");
    redirect('/login');
}
