
'use server';

import { addCampaign, updateCampaign as saveCampaign, deleteCampaign as removeCampaign } from '@/lib/campaign-service';
import type { Campaign } from '@/lib/mock-data';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { getUserById } from '@/lib/user-service';


export async function createCampaignAction(newCampaign: Omit<Campaign, 'id' | 'status' | 'submittedAt' | 'userId' | 'userName' | 'userEmail'>) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId) {
        throw new Error("User is not authenticated.");
    }
    const user = await getUserById(session.userId);

    const campaignToCreate: Campaign = {
        ...newCampaign,
        id: `draft_${Date.now()}`,
        status: "На модерации",
        submittedAt: new Date().toISOString(),
        userId: session.userId,
        userName: user?.name,
        userEmail: user?.email,
    };

    const createdCampaign = await addCampaign(campaignToCreate);
    revalidatePath('/campaigns');
    revalidatePath('/dashboard');
    revalidatePath('/admin');
    return { success: true, campaign: createdCampaign };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Не удалось создать рассылку.';
    return { success: false, message };
  }
}

export async function updateCampaignAction(campaign: Campaign) {
    try {
        await saveCampaign(campaign);
        revalidatePath('/campaigns');
        revalidatePath(`/campaigns/${campaign.id}/edit`);
        revalidatePath(`/admin/edit/${campaign.id}`);
        revalidatePath('/admin');
        revalidatePath('/dashboard');
        revalidatePath('/in-progress');
        return { success: true, campaign };
    } catch (error) {
        return { success: false, message: 'Не удалось сохранить рассылку.' };
    }
}

export async function deleteCampaignAction(campaignId: string) {
    try {
        await removeCampaign(campaignId);
        revalidatePath('/campaigns');
        revalidatePath('/admin');
        revalidatePath('/dashboard');
        revalidatePath('/in-progress');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, message: 'Не удалось удалить рассылку.' };
    }
}
