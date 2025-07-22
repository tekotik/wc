
'use server';

import 'server-only';
import { z } from 'zod';
import { createUser } from '@/lib/user-service';
import { createSession } from '@/lib/session';
import { redirect } from 'next/navigation';

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

  try {
    const user = await createUser(validatedFields.data);
    await createSession(user);
    // Redirect must be called outside of try/catch
  } catch (error) {
    const message = error instanceof Error ? error.message : "Произошла неизвестная ошибка.";
    return { success: false, message };
  }
  
  redirect('/dashboard');
}
