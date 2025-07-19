
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
      // If the file doesn't exist, create it with the initial mock data.
      await writeCampaigns(initialMockCampaigns);
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
        console.error('Error writing to campaigns file:', error);
        // This might fail on read-only filesystems like Vercel, which is expected.
        // For this demo, we accept that state might not be persisted in such environments.
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
        // If for some reason it's not found, add it to the start.
        campaigns.unshift(updatedCampaign);
    }
    await writeCampaigns(campaigns);
    inMemoryCampaigns = campaigns; // Update in-memory cache
}
