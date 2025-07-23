
'use server';

import 'server-only';
import { z } from 'zod';
import { createUser } from '@/lib/user-service';
import { getSession } from '@/lib/session';

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
    } | null;
    success: boolean;
}

export async function signupAction(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  // Correctly extract form data
  const data = Object.fromEntries(formData.entries());
  
  const validatedFields = signupSchema.safeParse(data);

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
  
  return {
    success: true,
    message: "Вы успешно зарегистрированы!",
    errors: null,
  }
}
