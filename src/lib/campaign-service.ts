
'use server';

import type { Campaign } from './mock-data';
import allCampaignsData from './campaigns.json';
import fs from 'fs/promises';
import path from 'path';

// Path to the JSON file
const campaignsFilePath = path.join(process.cwd(), 'src/lib/campaigns.json');

// Helper function to read campaigns from the file
async function readCampaigns(): Promise<Campaign[]> {
    try {
        const fileContent = await fs.readFile(campaignsFilePath, 'utf8');
        return JSON.parse(fileContent) as Campaign[];
    } catch (error) {
        console.error("Failed to read campaigns file:", error);
        // If the file doesn't exist or is empty, start with the initial data
        return allCampaignsData as Campaign[];
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
    const campaigns = await readCampaigns();
    return campaigns.sort((a, b) => new Date(b.id.split('_')[1]).getTime() - new Date(a.id.split('_')[1]).getTime());
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
