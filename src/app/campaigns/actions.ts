
'use server';

import { addRequest } from '@/lib/request-service';
import type { Campaign } from '@/lib/mock-data';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { getUserById } from '@/lib/user-service';


export async function createCampaignRequestAction(newCampaignData: Omit<Campaign, 'id' | 'status' | 'submittedAt' | 'userId' | 'userName' | 'userEmail'>) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId) {
        throw new Error("User is not authenticated.");
    }
    const user = await getUserById(session.userId);

    // Create a campaign with "На модерации" status
    const pendingCampaign: Campaign = {
        id: `draft_${Date.now()}`, // Temporary ID
        name: newCampaignData.name,
        text: newCampaignData.text,
        baseFile: newCampaignData.baseFile,
        status: 'На модерации',
        submittedAt: new Date().toISOString(),
        userId: session.userId,
        userName: user?.name || 'N/A',
        userEmail: user?.email || 'N/A',
    };
    
    // We will save this pending campaign to the main campaigns file
    const { updateCampaign } = await import('@/lib/campaign-service');
    await updateCampaign(pendingCampaign);

    revalidatePath('/campaigns');
    
    return { success: true, message: "Рассылка успешно отправлена на модерацию." };

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Не удалось создать заявку.';
    return { success: false, message };
  }
}

// The following actions are now mostly for admin use or internal state changes
// and need to be secured or refactored.

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
