
'use server';

import 'server-only';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// This is a mock login action. In a real app, you'd validate against a database.
// For now, any email/password combination will "work".

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
    
    // In a real app, you would verify the credentials here.
    // For this mock version, we'll just redirect to the dashboard.
    
    // We'll simulate a successful login and redirect.
    // In a real app with sessions, you'd set a session cookie here.
    
    revalidatePath('/', 'layout');
    redirect('/dashboard');
}

export async function logout() {
    // In a real app, you would clear the session cookie here.
    redirect('/login');
}
