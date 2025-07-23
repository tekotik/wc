
'use server';

import type { Campaign } from './mock-data';
import fs from 'fs/promises';
import path from 'path';
import { getSession } from './session';
import { getUserById } from './user-service';

// Path to the JSON file
const campaignsFilePath = path.join(process.cwd(), 'src/lib/campaigns.json');

// Helper function to read campaigns from the file
async function readCampaigns(): Promise<Campaign[]> {
    try {
        await fs.access(campaignsFilePath);
        const fileContent = await fs.readFile(campaignsFilePath, 'utf8');
        if (!fileContent) {
            return [];
        }
        return JSON.parse(fileContent) as Campaign[];
    } catch (error) {
        console.warn("Campaigns file not found or empty, creating a new one.");
        await writeCampaigns([]);
        return [];
    }
}

// Helper function to write campaigns to the file
async function writeCampaigns(campaigns: Campaign[]): Promise<void> {
    try {
        await fs.writeFile(campaignsFilePath, JSON.stringify(campaigns, null, 2), 'utf8');
    } catch (error) {
        console.error("Failed to write campaigns file:", error);
        throw new Error("Could not save campaigns.");
    }
}


export async function getCampaigns(userId?: string): Promise<Campaign[]> {
    const session = await getSession();
    const allCampaigns = await readCampaigns();

    // Admins see all campaigns, users see only their own
    if (session.isLoggedIn && session.userRole === 'admin') {
         return allCampaigns.sort((a, b) => new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime());
    }
    
    // For regular users, use the userId passed to the function, which should be their session.userId
    if (session.isLoggedIn && session.userRole === 'user' && session.userId) {
       const userCampaigns = allCampaigns.filter(c => c.userId === session.userId);
       return userCampaigns.sort((a, b) => new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime());
    }

    // If no user session, return empty array
    return [];
}

export async function addCampaign(newCampaign: Campaign): Promise<Campaign> {
    const campaigns = await readCampaigns();
    // Check for duplicate ID
    if (campaigns.some(c => c.id === newCampaign.id)) {
        // Handle error or generate a new ID
        throw new Error("Campaign with this ID already exists.");
    }
    const updatedCampaigns = [...campaigns, newCampaign];
    await writeCampaigns(updatedCampaigns);
    return newCampaign;
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
    const campaigns = await readCampaigns();
    return campaigns.find(campaign => campaign.id === id) || null;
}

export async function updateCampaign(updatedCampaign: Campaign): Promise<void> {
    let campaigns = await readCampaigns();
    const campaignIndex = campaigns.findIndex(c => c.id === updatedCampaign.id);

    if (campaignIndex === -1) {
        throw new Error("Campaign not found.");
    }
    
    campaigns[campaignIndex] = updatedCampaign;
    await writeCampaigns(campaigns);
}

export async function deleteCampaign(campaignId: string): Promise<void> {
    let campaigns = await readCampaigns();
    const updatedCampaigns = campaigns.filter(c => c.id !== campaignId);

    if (campaigns.length === updatedCampaigns.length) {
        // No campaign was deleted, maybe it didn't exist
        console.warn(`Attempted to delete non-existent campaign with ID: ${campaignId}`);
    }

    await writeCampaigns(updatedCampaigns);
}
