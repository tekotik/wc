
'use server';

import { addCampaign, updateCampaign as saveCampaign, deleteCampaign as removeCampaign } from '@/lib/campaign-service';
import type { Campaign } from '@/lib/mock-data';
import { revalidatePath } from 'next/cache';

export async function createCampaignAction(newCampaign: Campaign) {
  try {
    const createdCampaign = await addCampaign(newCampaign);
    revalidatePath('/campaigns');
    revalidatePath('/dashboard');
    revalidatePath('/admin');
    return { success: true, campaign: createdCampaign };
  } catch (error) {
    return { success: false, message: 'Не удалось создать рассылку.' };
  }
}

export async function updateCampaignAction(campaign: Campaign) {
    try {
        await saveCampaign(campaign);
        revalidatePath('/campaigns');
        revalidatePath(`/campaigns/${campaign.id}/edit`);
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
