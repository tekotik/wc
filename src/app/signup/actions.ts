
'use server';

import 'server-only';
import { z } from 'zod';
import { createUser } from '@/lib/user-service';
import { getSession } from '@/lib/session';
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
  
  const { name, email, password } = validatedFields.data;
  
  let newUser;
  try {
    newUser = await createUser({ name, email, password_raw: password });
  } catch (error) {
     const message = error instanceof Error ? error.message : "Неизвестная ошибка";
     return {
        success: false,
        errors: { server: message },
        message: message
    }
  }

  const session = await getSession();
  session.userId = newUser.id;
  session.isLoggedIn = true;
  session.userRole = newUser.role;
  await session.save();
  
  // A redirect is more appropriate here than a success message
  // because the component that shows the toast will handle the redirect.
  // Let's redirect directly to ensure flow is correct.
  redirect('/dashboard');
}
