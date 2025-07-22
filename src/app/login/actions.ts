
'use server';

import 'server-only';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerActionClient } from '@/lib/supabase/server';

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
    const supabase = createServerActionClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
        return { success: false, message: "Неверный email или пароль." };
    }

    revalidatePath('/', 'layout');
    redirect('/dashboard');
}

export async function logout() {
    const supabase = createServerActionClient();
    await supabase.auth.signOut();
    redirect('/login');
}
