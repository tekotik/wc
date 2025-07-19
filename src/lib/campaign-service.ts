
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { Campaign } from './mock-data';

// Note: In a real-world application, you would use a proper database.
// Using a JSON file for simplicity in this example.
const campaignsFilePath = path.join(process.cwd(), 'src', 'lib', 'campaigns.json');

async function readCampaigns(): Promise<Campaign[]> {
  try {
    const data = await fs.readFile(campaignsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      // If the file doesn't exist, return an empty array.
      return [];
    }
    console.error('Error reading campaigns file:', error);
    return [];
  }
}

async function writeCampaigns(campaigns: Campaign[]): Promise<void> {
    try {
        await fs.writeFile(campaignsFilePath, JSON.stringify(campaigns, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing to campaigns file:', error);
        throw new Error('Could not write to campaigns file.');
    }
}


export async function getCampaigns(): Promise<Campaign[]> {
  return await readCampaigns();
}

export async function addCampaign(newCampaign: Campaign): Promise<void> {
    const campaigns = await readCampaigns();
    campaigns.unshift(newCampaign); // Add to the beginning
    // await writeCampaigns(campaigns); // This will fail on a read-only filesystem like Vercel.
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
    const campaigns = await readCampaigns();
    return campaigns.find(c => c.id === id) || null;
}

export async function updateCampaign(updatedCampaign: Campaign): Promise<void> {
    const campaigns = await readCampaigns();
    const campaignIndex = campaigns.findIndex(c => c.id === updatedCampaign.id);
    if (campaignIndex === -1) {
        // To prevent errors on Vercel, we won't throw an error if the campaign isn't found
        // in the potentially stale JSON file. We'll just log it.
        console.warn(`Campaign with id ${updatedCampaign.id} not found for update.`);
        return;
    }
    campaigns[campaignIndex] = updatedCampaign;
    // await writeCampaigns(campaigns); // This will fail on a read-only filesystem like Vercel.
}
