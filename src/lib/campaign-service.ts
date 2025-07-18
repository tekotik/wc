'use server';

import fs from 'fs/promises';
import path from 'path';
import type { Campaign } from './mock-data';

const campaignsFilePath = path.join(process.cwd(), 'src', 'lib', 'campaigns.json');

export async function getCampaigns(): Promise<Campaign[]> {
  try {
    const data = await fs.readFile(campaignsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading campaigns file:', error);
    return [];
  }
}

export async function addCampaign(newCampaign: Campaign): Promise<void> {
  try {
    const campaigns = await getCampaigns();
    campaigns.unshift(newCampaign); // Add to the beginning
    await fs.writeFile(campaignsFilePath, JSON.stringify(campaigns, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to campaigns file:', error);
    throw new Error('Could not add campaign.');
  }
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
    const campaigns = await getCampaigns();
    return campaigns.find(c => c.id === id) || null;
}

export async function updateCampaign(updatedCampaign: Campaign): Promise<void> {
    try {
        const campaigns = await getCampaigns();
        const campaignIndex = campaigns.findIndex(c => c.id === updatedCampaign.id);
        if (campaignIndex === -1) {
            throw new Error('Campaign not found');
        }
        campaigns[campaignIndex] = updatedCampaign;
        await fs.writeFile(campaignsFilePath, JSON.stringify(campaigns, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error updating campaign:', error);
        throw new Error('Could not update campaign.');
    }
}
