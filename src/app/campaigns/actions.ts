
'use server';

import { addRequest } from '@/lib/request-service';
import type { Campaign } from '@/lib/mock-data';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';

// This action now correctly creates a moderation request instead of a campaign.
export async function createCampaignRequestAction(newCampaignData: Omit<Campaign, 'id' | 'status' | 'submittedAt' | 'userId' | 'userName' | 'userEmail'>) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId) {
        throw new Error("User is not authenticated.");
    }
    
    // The description for the request will be a stringified JSON of the campaign details.
    const requestDescription = JSON.stringify({
        name: newCampaignData.name,
        text: newCampaignData.text,
        baseFile: newCampaignData.baseFile,
    });

    await addRequest({
        user_id: session.userId,
        description: requestDescription,
    });

    revalidatePath('/admin'); // Revalidate admin page to show new request
    revalidatePath('/campaigns'); // Revalidate user's campaign list
    
    return { success: true, message: "Рассылка успешно отправлена на модерацию." };

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Не удалось создать заявку.';
    console.error("Error in createCampaignRequestAction:", message);
    return { success: false, message };
  }
}

// The following actions are for admin use or internal state changes.
import { updateCampaign as saveCampaign, deleteCampaign as removeCampaign } from '@/lib/campaign-service';

export async function updateCampaignAction(campaign: Campaign) {
    try {
        await saveCampaign(campaign);
        revalidatePath('/campaigns');
        revalidatePath(`/campaigns/${campaign.id}/edit`);
        revalidatePath('/admin');
        return { success: true, campaign };
    } catch (error) {
        return { success: false, message: 'Не удалось сохранить рассылку.' };
    }
}

export async function deleteCampaignAction(campaignId: string) {
    try {
        await removeCampaign(campaignId);
        revalidatePath('/campaigns');
        return { success: true };
    } catch (error) {
        return { success: false, message: 'Не удалось удалить рассылку.' };
    }
}
