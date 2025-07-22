
'use server';

import 'server-only';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';

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
        server?: string;
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
  
  const supabase = createServerClient();
  const { name, email, password } = validatedFields.data;
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
        balance: 1000 // Starting balance for new users
      },
    },
  });

  if (error) {
    console.error("Supabase signup error:", error);
    return {
        success: false,
        errors: { server: error.message },
        message: "Ошибка регистрации. Возможно, пользователь с таким email уже существует."
    }
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}
