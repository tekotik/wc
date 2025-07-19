
'use server';

import { addCampaign, updateCampaign as saveCampaign } from '@/lib/campaign-service';
import type { Campaign } from '@/lib/mock-data';
import { revalidatePath } from 'next/cache';

export async function createCampaignAction(newCampaign: Campaign) {
  try {
    const createdCampaign = await addCampaign(newCampaign);
    revalidatePath('/campaigns');
    revalidatePath('/dashboard');
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
        return { success: true, campaign };
    } catch (error) {
        return { success: false, message: 'Не удалось сохранить рассылку.' };
    }
}
