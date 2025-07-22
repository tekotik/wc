
'use server';

import 'server-only';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerActionClient } from '@/lib/supabase/server';

const signupSchema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать не менее 2 символов." }),
  email: z.string().email({ message: "Неверный формат email." }),
  password: z.string().min(6, { message: "Пароль должен содержать не менее 6 символов." }),
});

export type SignupFormState = {
    message: string;
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
    };
    success: boolean;
}

export async function signupAction(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const validatedFields = signupSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Пожалуйста, исправьте ошибки в форме.",
    };
  }
  
  const { name, email, password } = validatedFields.data;
  const supabase = createServerActionClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        balance: 15300 // Set initial balance
      },
    },
  });

  if (error) {
    const message = error.code === 'user_already_exists' 
        ? 'Пользователь с таким email уже существует.'
        : `Произошла ошибка: ${error.message}`;
    return { success: false, message };
  }
  
  revalidatePath('/', 'layout');
  redirect('/dashboard');
}
