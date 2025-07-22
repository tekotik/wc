// @/app/actions.ts
"use server";

import { z } from "zod";
import { addCampaign } from "@/lib/campaign-service";

const inputSchema = z.object({
  csvUrl: z.string().min(1, { message: "Ссылка на CSV обязательна." }),
  campaignName: z.string().min(3, { message: "Название должно содержать не менее 3 символов." }),
  messageCount: z.coerce.number().int().positive({ message: "Количество сообщений должно быть положительным числом." }),
});

export type ClientLinkFormState = {
  message: string | null;
  errors: {
    csvUrl?: string[];
    campaignName?: string[];
    messageCount?: string[];
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
  });

  if (!validatedFields.success) {
    return {
      message: "Неверные данные формы.",
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }
  
  const { campaignName, csvUrl, messageCount } = validatedFields.data;

  try {
    const campaignId = `campaign_${Date.now()}`;
    const newCampaign = {
      id: campaignId,
      name: campaignName,
      status: "Активна",
      text: `Рассылка на ${messageCount} сообщений. База: ${csvUrl}`,
    };
    
    // In a real app, you would save this campaign to a database.
    // For now, let's just use the mock service.
    await addCampaign(newCampaign);

    const clientLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/c/${campaignId}`;
    const scheduledAt = new Date();
    scheduledAt.setHours(scheduledAt.getHours() + 1);

    return {
      message: "Ссылка успешно сгенерирована!",
      errors: null,
      data: {
        clientLink,
        campaignName,
        scheduledAt: scheduledAt.toLocaleString('ru-RU', { dateStyle: 'full', timeStyle: 'short' }),
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
