
'use server';

import { getCampaignById } from '@/lib/campaign-service';
import { getRepliesFromCsvUrl } from '@/lib/replies-service';
import type { Campaign, Reply } from '@/lib/mock-data';

export async function getCampaignDataAction(
  campaignId: string
): Promise<{ success: boolean; campaign?: Campaign; replies?: Reply[]; error?: string }> {
  try {
    const campaign = await getCampaignById(campaignId);

    if (!campaign) {
      return { success: false, error: 'Кампания не найдена.' };
    }
    
    // In our simplified model, the client-facing page uses the campaign text as the source for replies.
    // In a real app, this might be a dedicated CSV URL per campaign.
    // The "csvUrl" is stored in the `text` field for campaigns created via the admin form.
    const csvUrlMatch = campaign.text.match(/База: (https?:\/\/[^\s]+)/);
    const csvUrl = csvUrlMatch ? csvUrlMatch[1] : null;

    if (!csvUrl) {
         return { success: true, campaign, replies: [] }; // Return campaign data but no replies if no URL
    }

    const { replies } = await getRepliesFromCsvUrl(csvUrl);
    return { success: true, campaign, replies };
  } catch (error) {
    console.error(`Error getting campaign data for ${campaignId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка.';
    return { success: false, error: errorMessage };
  }
}
