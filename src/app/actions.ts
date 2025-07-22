// @/app/actions.ts
"use server";

import { z } from "zod";
import { addCampaign } from "@/lib/campaign-service";
import { revalidatePath } from "next/cache";

const inputSchema = z.object({
  csvUrl: z.string().min(1, { message: "Ссылка на CSV обязательна." }),
  campaignName: z.string().min(3, { message: "Название должно содержать не менее 3 символов." }),
  messageCount: z.coerce.number().int().positive({ message: "Количество сообщений должно быть положительным числом." }),
  scheduledAt: z.string().min(1, { message: "Дата и время обязательны." }),
});

export type ClientLinkFormState = {
  message: string | null;
  errors: {
    csvUrl?: string[];
    campaignName?: string[];
    messageCount?: string[];
    scheduledAt?: string[];
    server?: string;
  } | null;
  data: {
    clientLink: string;
    campaignName: string;
    scheduledAt: string;
  } | null;
};

export async function generateClientLinkAction(
  prevState: ClientLinkFormState,
  formData: FormData
): Promise<ClientLinkFormState> {
  const validatedFields = inputSchema.safeParse({
    csvUrl: formData.get("csvUrl"),
    campaignName: formData.get("campaignName"),
    messageCount: formData.get("messageCount"),
    scheduledAt: formData.get("scheduledAt"),
  });

  if (!validatedFields.success) {
    return {
      message: "Неверные данные формы.",
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }
  
  const { campaignName, csvUrl, messageCount, scheduledAt } = validatedFields.data;

  try {
    const campaignId = `campaign_${Date.now()}`;
    const newCampaign = {
      id: campaignId,
      name: campaignName,
      status: "Активна",
      text: `Рассылка на ${messageCount} сообщений. База: ${csvUrl}`,
      scheduledAt: new Date(scheduledAt).toISOString(), // Store as ISO string
    };
    
    await addCampaign(newCampaign);

    // Revalidate paths to show the new campaign immediately
    revalidatePath('/dashboard');
    revalidatePath('/in-progress');


    const clientLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/c/${campaignId}`;

    return {
      message: "Рассылка успешно создана и запущена!",
      errors: null,
      data: {
        clientLink,
        campaignName,
        scheduledAt: new Date(scheduledAt).toLocaleString('ru-RU', { dateStyle: 'full', timeStyle: 'short' }),
      },
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Произошла неизвестная ошибка.";
    return {
      message: "Произошла непредвиденная ошибка.",
      errors: { server: `Не удалось создать ссылку: ${errorMessage}` },
      data: null,
    };
  }
}
