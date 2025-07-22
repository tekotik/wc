
'use server';

import type { Campaign } from './mock-data';
import { sql } from './db';

export async function getCampaigns(): Promise<Campaign[]> {
    try {
        const campaigns = await sql<Campaign[]>`SELECT * FROM campaigns ORDER BY created_at DESC`;
        return campaigns;
    } catch (error) {
        console.error("Failed to fetch campaigns:", error);
        return [];
    }
}

export async function addCampaign(newCampaign: Omit<Campaign, 'id' | 'createdAt'>): Promise<Campaign> {
    try {
        const [campaign] = await sql<Campaign[]>`
            INSERT INTO campaigns (name, status, text, rejection_reason, base_file, stats, scheduled_at)
            VALUES (${newCampaign.name}, ${newCampaign.status}, ${newCampaign.text}, ${newCampaign.rejectionReason || null}, ${newCampaign.baseFile ? JSON.stringify(newCampaign.baseFile) : null}, ${newCampaign.stats ? JSON.stringify(newCampaign.stats) : null}, ${newCampaign.scheduledAt || null})
            RETURNING *
        `;
        return campaign;
    } catch (error) {
        console.error("Failed to add campaign:", error);
        throw new Error("Could not add campaign.");
    }
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
    try {
        const [campaign] = await sql<Campaign[]>`SELECT * FROM campaigns WHERE id = ${id}`;
        return campaign || null;
    } catch (error) {
        console.error("Failed to fetch campaign by id:", error);
        return null;
    }
}

export async function updateCampaign(updatedCampaign: Campaign): Promise<void> {
    try {
        await sql`
            UPDATE campaigns
            SET
                name = ${updatedCampaign.name},
                status = ${updatedCampaign.status},
                text = ${updatedCampaign.text},
                rejection_reason = ${updatedCampaign.rejectionReason || null},
                base_file = ${updatedCampaign.baseFile ? JSON.stringify(updatedCampaign.baseFile) : null},
                stats = ${updatedCampaign.stats ? JSON.stringify(updatedCampaign.stats) : null},
                scheduled_at = ${updatedCampaign.scheduledAt || null}
            WHERE id = ${updatedCampaign.id}
        `;
    } catch (error) {
        console.error("Failed to update campaign:", error);
        throw new Error("Could not update campaign.");
    }
}

export async function deleteCampaign(campaignId: string): Promise<void> {
     try {
        await sql`
            DELETE FROM campaigns WHERE id = ${campaignId}
        `;
    } catch (error) {
        console.error("Failed to delete campaign:", error);
        throw new Error("Could not delete campaign.");
    }
}
