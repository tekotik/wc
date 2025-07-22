
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { Campaign } from './mock-data';

// Note: In a real-world application, you would use a proper database.
// Using a JSON file for simplicity and an in-memory array for Vercel compatibility.
const campaignsFilePath = path.join(process.cwd(), 'src', 'lib', 'campaigns.json');

// In-memory store for campaigns, primarily for Vercel's read-only filesystem.
let inMemoryCampaigns: Campaign[] | null = null;

async function readCampaignsFromFile(): Promise<Campaign[]> {
  try {
    const data = await fs.readFile(campaignsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      // If the file doesn't exist, create it with empty array
      await writeCampaigns([]);
      return [];
    }
    console.error('Error reading campaigns file:', error);
    // Fallback to empty array on other errors
    return [];
  }
}

async function writeCampaigns(campaigns: Campaign[]): Promise<void> {
    try {
        await fs.writeFile(campaignsFilePath, JSON.stringify(campaigns, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing to campaigns file:', error);
        // This might fail on read-only filesystems like Vercel, which is expected.
    }
}


export async function getCampaigns(): Promise<Campaign[]> {
    // Always read from the file to get the latest state.
    inMemoryCampaigns = await readCampaignsFromFile();
    return inMemoryCampaigns;
}

export async function addCampaign(newCampaign: Campaign): Promise<Campaign> {
    const campaigns = await getCampaigns();
    const newCampaigns = [newCampaign, ...campaigns];
    await writeCampaigns(newCampaigns);
    inMemoryCampaigns = newCampaigns; // Update in-memory cache
    return newCampaign;
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
    const campaigns = await getCampaigns();
    const campaign = campaigns.find(c => c.id === id);
    return campaign || null;
}

export async function updateCampaign(updatedCampaign: Campaign): Promise<void> {
    let campaigns = await getCampaigns();
    const campaignIndex = campaigns.findIndex(c => c.id === updatedCampaign.id);

    if (campaignIndex !== -1) {
        campaigns[campaignIndex] = updatedCampaign;
    } else {
        campaigns.unshift(updatedCampaign);
    }
    await writeCampaigns(campaigns);
    inMemoryCampaigns = campaigns;
}

export async function deleteCampaign(campaignId: string): Promise<void> {
    let campaigns = await getCampaigns();
    const newCampaigns = campaigns.filter(c => c.id !== campaignId);
    await writeCampaigns(newCampaigns);
    inMemoryCampaigns = newCampaigns;
}
