// @/app/actions.ts
"use server";

import { generateMessageVariations } from "@/ai/flows/generate-message-variations";
import { z } from "zod";

const inputSchema = z.object({
  details: z.string().min(10, {
    message: "Детали рассылки должны содержать не менее 10 символов.",
  }),
  numberOfVariations: z.coerce.number().int().min(1).max(5).default(3),
});

export type FormState = {
  message: string | null;
  errors: {
    details?: string[];
    numberOfVariations?: string[];
    server?: string;
  } | null;
  data: string[] | null;
};

export async function generateMessagesAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = inputSchema.safeParse({
    details: formData.get("details"),
    numberOfVariations: formData.get("numberOfVariations"),
  });

  if (!validatedFields.success) {
    return {
      message: "Неверные данные формы.",
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const result = await generateMessageVariations(validatedFields.data);
    if (!result.messageVariations || result.messageVariations.length === 0) {
      return {
        message: "ИИ не смог сгенерировать сообщения на основе вашего ввода. Пожалуйста, попробуйте еще раз с более конкретными деталями.",
        errors: { server: "Варианты не сгенерированы." },
        data: null,
      }
    }
    return {
      message: "Успех!",
      errors: null,
      data: result.messageVariations,
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Произошла неизвестная ошибка.";
    return {
      message: "Произошла непредвиденная ошибка.",
      errors: { server: `Не удалось подключиться к сервису ИИ: ${errorMessage}` },
      data: null,
    };
  }
}
