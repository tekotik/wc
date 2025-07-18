// @/app/actions.ts
"use server";

import { generateMessageVariations } from "@/ai/flows/generate-message-variations";
import { z } from "zod";

const inputSchema = z.object({
  campaignDetails: z.string().min(10, {
    message: "Campaign details must be at least 10 characters long.",
  }),
  numberOfVariations: z.coerce.number().int().min(1).max(5).default(3),
});

export type FormState = {
  message: string | null;
  errors: {
    campaignDetails?: string[];
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
    campaignDetails: formData.get("campaignDetails"),
    numberOfVariations: formData.get("numberOfVariations"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const result = await generateMessageVariations(validatedFields.data);
    if (!result.messageVariations || result.messageVariations.length === 0) {
      return {
        message: "The AI couldn't generate messages based on your input. Please try again with more specific details.",
        errors: { server: "No variations generated." },
        data: null,
      }
    }
    return {
      message: "Success!",
      errors: null,
      data: result.messageVariations,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred.",
      errors: { server: "Failed to connect to the AI service. Please try again later." },
      data: null,
    };
  }
}
