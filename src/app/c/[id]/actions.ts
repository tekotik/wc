
'use server';

import { getCampaignById } from '@/lib/campaign-service';
import { getRepliesFromCsvUrl } from '@/lib/replies-service';
import type { Campaign, Reply } from '@/lib/mock-data';

// Этот файл больше не используется компонентом client-replies-view,
// так как мы перешли на прямой API-маршрут для обхода кеширования.
// Но мы оставим его на случай, если он понадобится для других серверных операций в будущем.

export async function getCampaignDataAction(
  campaignId: string
): Promise<{ success: boolean; campaign?: Campaign; replies?: Reply[]; error?: string }> {
  try {
    const campaign = await getCampaignById(campaignId);

    if (!campaign) {
      return { success: false, error: 'Кампания не найдена.' };
    }

    const csvUrlMatch = campaign.text.match(/База: (https?:\/\/[^\s]+)/);
    const csvUrl = csvUrlMatch ? csvUrlMatch[1] : null;
    
    const { replies } = await getRepliesFromCsvUrl(csvUrl);

    return { success: true, campaign, replies };
  } catch (error) {
    console.error(`Error getting campaign data for ${campaignId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка.';
    return { success: false, error: errorMessage };
  }
}
