
'use server';

import { _addRequest } from '@/lib/request-service';
import type { Campaign } from '@/lib/mock-data';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { updateCampaign as saveCampaign, deleteCampaign as removeCampaign, _addCampaignDraft } from '@/lib/campaign-service';
import { withFileLock } from '@/lib/user-service';


// This action now correctly creates a moderation request AND a draft campaign.
export async function createCampaignRequestAction(newCampaignData: Omit<Campaign, 'id' | 'status' | 'submittedAt' | 'userId' | 'userName' | 'userEmail'>) {
  // Wrap the entire operation in a single file lock to prevent race conditions.
  return withFileLock(async () => {
    try {
      const session = await getSession();
      if (!session.isLoggedIn || !session.userId) {
          throw new Error("User is not authenticated.");
      }
      
      // 1. Generate a consistent ID for both request and campaign
      const campaignId = `campaign_draft_${Date.now()}`;

      // 2. Create the campaign draft that the user will see
      // Use the internal, non-locking version of the function
      await _addCampaignDraft({
          ...newCampaignData,
          id: campaignId,
      }, session);

      // 3. Create the moderation request for the admin
      const requestDescription = JSON.stringify({
          name: newCampaignData.name,
          text: newCampaignData.text,
          baseFile: newCampaignData.baseFile,
      });
      
      // Use the internal, non-locking version of the function
      await _addRequest({
          user_id: session.userId,
          description: requestDescription,
          campaignId: campaignId, // Link request to the campaign draft
      });

      revalidatePath('/admin'); // Revalidate admin page to show new request
      revalidatePath('/campaigns'); // Revalidate user's campaign list
      
      return { success: true, message: "Рассылка успешно отправлена на модерацию." };

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось создать заявку.';
      console.error("Error in createCampaignRequestAction:", message);
      return { success: false, message };
    }
  });
}

export async function updateCampaignAction(campaign: Campaign) {
    try {
        await saveCampaign(campaign);
        revalidatePath('/campaigns');
        revalidatePath(`/campaigns/${campaign.id}/edit`);
        revalidatePath('/admin');
        return { success: true, campaign };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Не удалось сохранить рассылку.";
        return { success: false, message };
    }
}

export async function deleteCampaignAction(campaignId: string) {
    try {
        await removeCampaign(campaignId);
        revalidatePath('/campaigns');
        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Не удалось удалить рассылку.";
        return { success: false, message };
    }
}
