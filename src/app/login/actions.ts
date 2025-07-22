
'use server';

import { z } from 'zod';
import { createUser, findUserByEmail, verifyPassword, type User } from '@/lib/user-service';
import { createSession, deleteSession, getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

const signupSchema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать не менее 2 символов." }),
  email: z.string().email({ message: "Неверный формат email." }),
  password: z.string().min(6, { message: "Пароль должен содержать не менее 6 символов." }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Неверный формат email." }),
  password: z.string().min(1, { message: "Пароль не может быть пустым." }),
});

type FormState = {
    success: boolean;
    message: string;
}

export async function signup(data: z.infer<typeof signupSchema>): Promise<FormState> {
  const validatedFields = signupSchema.safeParse(data);

  if (!validatedFields.success) {
    return { success: false, message: 'Неверные данные.' };
  }

  try {
    const user = await createUser(validatedFields.data);
    await createSession(user);
    return { success: true, message: `Добро пожаловать, ${user.name}!` };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Произошла неизвестная ошибка.";
    return { success: false, message };
  }
}

export async function login(data: z.infer<typeof loginSchema>): Promise<FormState> {
    const validatedFields = loginSchema.safeParse(data);

    if (!validatedFields.success) {
        return { success: false, message: 'Неверные данные.' };
    }

    const { email, password } = validatedFields.data;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            return { success: false, message: 'Пользователь не найден.' };
        }

        const isPasswordCorrect = await verifyPassword(password, user.passwordHash);

        if (!isPasswordCorrect) {
            return { success: false, message: 'Неверный пароль.' };
        }
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash: _, ...userWithoutPassword } = user;

        await createSession(userWithoutPassword);
        return { success: true, message: 'Вход выполнен успешно!' };

    } catch (error) {
        const message = error instanceof Error ? error.message : "Произошла неизвестная ошибка.";
        return { success: false, message };
    }
}


export async function logout() {
    await deleteSession();
    redirect('/login');
}

export async function getSessionUser(): Promise<User | null> {
    const session = await getSession();
    return session?.user ?? null;
}
