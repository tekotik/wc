
'use server'

import { revalidatePath } from "next/cache";
import { updateRequest, type Request as RequestType } from "@/lib/request-service";
import { createCampaignAfterApproval } from "@/lib/campaign-service";
import type { Campaign } from "@/lib/mock-data";
import { getUserById } from "@/lib/user-service";

export async function updateRequestAction(requestData: Pick<RequestType, 'id' | 'status' | 'admin_comment'> & { description?: string }) {
    try {
        const updatedRequest = await updateRequest(requestData);

        // If the request is approved, create the actual campaign
        if (updatedRequest.status === 'approved' && updatedRequest.description) {
            const campaignDetails = JSON.parse(updatedRequest.description);
            const user = await getUserById(updatedRequest.user_id);

            const newCampaign: Campaign = {
                id: `campaign_${Date.now()}`,
                name: campaignDetails.name,
                text: campaignDetails.text,
                baseFile: campaignDetails.baseFile,
                status: 'Одобрено', // Start as "Approved"
                userId: updatedRequest.user_id,
                submittedAt: new Date().toISOString(),
                userName: user?.name, 
                userEmail: user?.email,
                repliesCsvUrl: campaignDetails.repliesCsvUrl,
                scheduledAt: campaignDetails.scheduledAt,
            };
            await createCampaignAfterApproval(newCampaign);
        }

        revalidatePath('/admin');
        revalidatePath('/campaigns');
        return { success: true, request: updatedRequest };
    } catch(error) {
        const message = error instanceof Error ? error.message : "Не удалось обновить заявку."
        return { success: false, message };
    }
}
