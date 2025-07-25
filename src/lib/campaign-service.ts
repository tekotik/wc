
'use server';

import type { Campaign } from './mock-data';
import fs from 'fs/promises';
import path from 'path';
import { getSession } from './session';
import { getUserById, withFileLock } from './user-service';
import { _addRequest } from './request-service';

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

// This function is for Admins to create campaigns directly via their form
export async function addCampaign(newCampaign: Omit<Campaign, 'id'>): Promise<Campaign> {
  return withFileLock(async () => {
    const campaigns = await readCampaigns();
    const campaignToAdd: Campaign = {
        ...newCampaign,
        id: `campaign_${Date.now()}`,
    };
    
    const updatedCampaigns = [...campaigns, campaignToAdd];
    await writeCampaigns(updatedCampaigns);

    return campaignToAdd;
  });
}


// Internal, non-locking version for use inside other locked functions
export async function _addCampaignDraft(newCampaignData: Omit<Campaign, 'userId' | 'userName' | 'userEmail' | 'submittedAt'>, session: any) {
    if (!session.isLoggedIn || !session.userId) {
        throw new Error("Authentication required.");
    }
    const user = await getUserById(session.userId);
    const campaigns = await readCampaigns();
    
    const campaignDraft: Campaign = {
        ...newCampaignData,
        status: 'На модерации',
        userId: session.userId,
        userName: user?.name,
        userEmail: user?.email,
        submittedAt: new Date().toISOString(),
    };

    const updatedCampaigns = [...campaigns, campaignDraft];
    await writeCampaigns(updatedCampaigns);
    return campaignDraft;
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
    const campaigns = await readCampaigns();
    return campaigns.find(campaign => campaign.id === id) || null;
}

export async function updateCampaign(updatedCampaign: Campaign): Promise<void> {
  return withFileLock(async () => {
    let campaigns = await readCampaigns();
    const campaignIndex = campaigns.findIndex(c => c.id === updatedCampaign.id);

    if (campaignIndex === -1) {
        throw new Error(`Campaign with ID ${updatedCampaign.id} not found.`);
    } else {
        // Otherwise, update the existing campaign
        campaigns[campaignIndex] = updatedCampaign;
    }
    
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
