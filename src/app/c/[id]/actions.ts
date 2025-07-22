
'use server';

import { getCampaignById } from '@/lib/campaign-service';
import { getRepliesFromCsvUrl } from '@/lib/replies-service';
import type { Campaign, Reply } from '@/lib/mock-data';

export async function getCampaignDataAction(
  campaignId: string
): Promise<{ success: boolean; campaign?: Campaign; replies?: Reply[]; error?: string; lastUpdated?: Date }> {
  try {
    const campaign = await getCampaignById(campaignId);

    if (!campaign) {
      return { success: false, error: 'Кампания не найдена.' };
    }

    // The "csvUrl" is stored in the `text` field for campaigns created via the admin form.
    const csvUrlMatch = campaign.text.match(/База: (https?:\/\/[^\s]+)/);
    const csvUrl = csvUrlMatch ? csvUrlMatch[1] : null;

    if (!csvUrl) {
       // Return the campaign but with empty replies if there is no CSV URL associated.
       return { success: true, campaign, replies: [], lastUpdated: new Date() };
    }

    // We pass the extracted URL to the service
    const { replies } = await getRepliesFromCsvUrl(csvUrl);

    return { success: true, campaign, replies, lastUpdated: new Date() };
  } catch (error) {
    console.error(`Error getting campaign data for ${campaignId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка.';
    return { success: false, error: errorMessage };
  }
}
