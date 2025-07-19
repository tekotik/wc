
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
    // This function will not be used in the Vercel environment to avoid write errors.
    // try {
    //     await fs.writeFile(campaignsFilePath, JSON.stringify(campaigns, null, 2), 'utf-8');
    // } catch (error) {
    //     console.error('Error writing to campaigns file (this is expected on Vercel):', error);
    // }
}


export async function getCampaigns(): Promise<Campaign[]> {
  if (inMemoryCampaigns === null) {
      inMemoryCampaigns = await readCampaignsFromFile();
  }
  return inMemoryCampaigns;
}

export async function addCampaign(newCampaign: Campaign): Promise<Campaign> {
    const campaigns = await getCampaigns();
    // Add to the beginning of the in-memory array for the current serverless function's lifetime
    campaigns.unshift(newCampaign);
    // Return the created campaign object so the client can handle it
    return newCampaign;
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
    const campaigns = await getCampaigns();
    const campaign = campaigns.find(c => c.id === id);

    // If not found in memory, it won't exist on the next request on Vercel
    if (!campaign) {
        console.warn(`Campaign with id ${id} not found in memory.`);
        return null;
    }
    
    return campaign;
}

export async function updateCampaign(updatedCampaign: Campaign): Promise<void> {
    let campaigns = await getCampaigns();
    const campaignIndex = campaigns.findIndex(c => c.id === updatedCampaign.id);
    if (campaignIndex === -1) {
        console.warn(`Campaign with id ${updatedCampaign.id} not found for update. Adding it to the list.`);
        // If not found, add it. This can happen if the in-memory store was reset.
        campaigns.unshift(updatedCampaign);
    } else {
        campaigns[campaignIndex] = updatedCampaign;
    }
}
