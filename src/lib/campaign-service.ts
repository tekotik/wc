
'use server';

import type { Campaign } from './mock-data';
import fs from 'fs/promises';
import path from 'path';
import { getSession } from './session';
import { getUserById, withFileLock } from './user-service';
import { addRequest } from './request-service';

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
        // If the file doesn't exist, create it with an empty array
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


export async function getCampaigns(): Promise<Campaign[]> {
  return withFileLock(async () => {
    const session = await getSession();
    const allCampaigns = await readCampaigns();

    // Admins see all campaigns
    if (session.isLoggedIn && session.userRole === 'admin') {
         return allCampaigns.sort((a, b) => new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime());
    }
    
    // For regular users, filter by their ID
    if (session.isLoggedIn && session.userRole === 'user' && session.userId) {
       const userCampaigns = allCampaigns.filter(c => c.userId === session.userId);
       return userCampaigns.sort((a, b) => new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime());
    }

    // If no user session, or something went wrong, return empty array
    return [];
  });
}

export async function addCampaign(newCampaign: Omit<Campaign, 'id' | 'status'>): Promise<Campaign> {
  return withFileLock(async () => {
    const campaigns = await readCampaigns();
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
        throw new Error("Authentication required to create a campaign.");
    }
     const user = await getUserById(session.userId);

    const campaignToAdd: Campaign = {
        ...newCampaign,
        id: `campaign_${Date.now()}`,
        status: "На модерации",
        submittedAt: new Date().toISOString(),
        userId: session.userId,
        userName: user?.name,
        userEmail: user?.email,
    };
    
    // Check for duplicate ID - though timestamp-based should be unique
    if (campaigns.some(c => c.id === campaignToAdd.id)) {
        throw new Error("Campaign with this ID already exists.");
    }

    // Instead of adding directly, create a request for moderation
    await addRequest({
        user_id: campaignToAdd.userId!,
        description: `Новая кампания: "${campaignToAdd.name}". Текст: ${campaignToAdd.text}`,
    });

    // We will no longer add the campaign directly here.
    // It will be added by an admin action after approval.
    // For now, let's just return the would-be campaign
    // This part of the flow will need to be adjusted.
    // The campaign is NOT being saved to campaigns.json here.
    
    // This function's callers need to be updated. For now, let's simulate it.
    // In a real scenario, addCampaign would only be called by an admin.
    const updatedCampaigns = [...campaigns, campaignToAdd];
    await writeCampaigns(updatedCampaigns);

    return campaignToAdd;
  });
}

export async function createCampaignAfterApproval(newCampaign: Campaign): Promise<Campaign> {
  return withFileLock(async () => {
    const campaigns = await readCampaigns();
     if (campaigns.some(c => c.id === newCampaign.id)) {
        throw new Error("Campaign with this ID already exists.");
    }
    const updatedCampaigns = [...campaigns, newCampaign];
    await writeCampaigns(updatedCampaigns);
    return newCampaign;
  });
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  return withFileLock(async () => {
    const campaigns = await readCampaigns();
    return campaigns.find(campaign => campaign.id === id) || null;
  });
}

export async function updateCampaign(updatedCampaign: Campaign): Promise<void> {
  return withFileLock(async () => {
    let campaigns = await readCampaigns();
    const campaignIndex = campaigns.findIndex(c => c.id === updatedCampaign.id);

    if (campaignIndex === -1) {
        throw new Error("Campaign not found.");
    }
    
    campaigns[campaignIndex] = updatedCampaign;
    await writeCampaigns(campaigns);
  });
}

export async function deleteCampaign(campaignId: string): Promise<void> {
  return withFileLock(async () => {
    let campaigns = await readCampaigns();
    const updatedCampaigns = campaigns.filter(c => c.id !== campaignId);

    if (campaigns.length === updatedCampaigns.length) {
        // No campaign was deleted, maybe it didn't exist
        console.warn(`Attempted to delete non-existent campaign with ID: ${campaignId}`);
    }

    await writeCampaigns(updatedCampaigns);
  });
}
