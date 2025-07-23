
'use server'

import { revalidatePath } from "next/cache";
import { updateRequest, type Request as RequestType } from "@/lib/request-service";
import { createCampaignAfterApproval } from "@/lib/campaign-service";
import type { Campaign } from "@/lib/mock-data";

export async function updateRequestAction(requestData: Pick<RequestType, 'id' | 'status' | 'admin_comment'> & { description?: string }) {
    try {
        const updatedRequest = await updateRequest(requestData);

        // If the request is approved, create the actual campaign
        if (updatedRequest.status === 'approved' && updatedRequest.description) {
            const campaignDetails = JSON.parse(updatedRequest.description);
            const newCampaign: Campaign = {
                id: `campaign_${Date.now()}`,
                name: campaignDetails.name,
                text: campaignDetails.text,
                baseFile: campaignDetails.baseFile,
                status: 'Одобрено', // Start as "Approved"
                userId: updatedRequest.user_id,
                submittedAt: new Date().toISOString(),
                // You might want to fetch user name/email here
                userName: 'Unknown', 
                userEmail: 'unknown@example.com'
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
