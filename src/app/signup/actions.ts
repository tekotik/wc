
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
    };
    success: boolean;
}

export async function signupAction(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  console.log("[Signup Action] Started.");
  const validatedFields = signupSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    console.error("[Signup Action] Form validation failed:", validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Пожалуйста, исправьте ошибки в форме.",
    };
  }
  
  const { name, email, password } = validatedFields.data;
  
  let newUser;
  try {
    console.log("[Signup Action] Calling createUser for email:", email);
    newUser = await createUser({ name, email, password_raw: password });
    console.log("[Signup Action] createUser successful for email:", email);
  } catch (error) {
     const message = error instanceof Error ? error.message : "Неизвестная ошибка";
     console.error("[Signup Action] Error during createUser:", message);
     return {
        success: false,
        errors: { server: message },
        message: message
    }
  }

  const session = await getSession();
  session.userId = newUser.id;
  session.isLoggedIn = true;
  await session.save();

  console.log("[Signup Action] User created and session saved.");
  
  // Return a success state instead of redirecting
  // The redirect will be handled by the client component after showing the toast
  return {
    success: true,
    message: "Вы успешно зарегистрированы!",
  };
}
