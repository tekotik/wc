
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { Campaign } from './mock-data';
import { mockCampaigns as initialMockCampaigns } from './mock-data'; // Import initial mock data

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
      // If the file doesn't exist, return the initial mock data.
      return initialMockCampaigns;
    }
    console.error('Error reading campaigns file:', error);
    // Fallback to initial mock data on other errors
    return initialMockCampaigns;
  }
}

async function writeCampaigns(campaigns: Campaign[]): Promise<void> {
    try {
        await fs.writeFile(campaignsFilePath, JSON.stringify(campaigns, null, 2), 'utf-8');
    } catch (error) {
        // This will fail on Vercel, but we log the error for debugging.
        console.error('Error writing to campaigns file (this is expected on Vercel):', error);
    }
}


export async function getCampaigns(): Promise<Campaign[]> {
  if (inMemoryCampaigns === null) {
      inMemoryCampaigns = await readCampaignsFromFile();
  }
  return inMemoryCampaigns;
}

export async function addCampaign(newCampaign: Campaign): Promise<void> {
    const campaigns = await getCampaigns();
    campaigns.unshift(newCampaign); // Add to the beginning of the in-memory array
    // We don't write to file on Vercel to avoid errors. The change exists in memory for the session.
    // await writeCampaigns(campaigns);
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
    const campaigns = await getCampaigns();
    return campaigns.find(c => c.id === id) || null;
}

export async function updateCampaign(updatedCampaign: Campaign): Promise<void> {
    const campaigns = await getCampaigns();
    const campaignIndex = campaigns.findIndex(c => c.id === updatedCampaign.id);
    if (campaignIndex === -1) {
        console.warn(`Campaign with id ${updatedCampaign.id} not found for update.`);
        // If not found, add it. This can happen if the in-memory store was reset.
        campaigns.unshift(updatedCampaign);
    } else {
        campaigns[campaignIndex] = updatedCampaign;
    }
    // We don't write to file on Vercel to avoid errors.
    // await writeCampaigns(campaigns);
}
