
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { Reply } from './mock-data';
import { revalidatePath } from 'next/cache';
import Papa from 'papaparse';

const REPLIES_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1ZWOfOyo2E_aCUri_Pa8M9D0azFGiaA9fuaszyAdpnfI/export?format=csv&gid=0';

let inMemoryReplies: Reply[] | null = null;

async function fetchRepliesFromSheet(): Promise<Reply[]> {
    try {
        const response = await fetch(REPLIES_SHEET_URL, {
            // Revalidate every 60 seconds
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch spreadsheet: ${response.statusText}`);
        }

        const csvText = await response.text();
        
        return new Promise((resolve, reject) => {
            Papa.parse<any>(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const replies: Reply[] = results.data.map((row, index) => ({
                        campaignId: row.campaignId || `unknown_campaign_${index}`,
                        name: row.name || `Unknown User ${index + 1}`,
                        reply: row.reply || '',
                        time: row.time || 'just now',
                        // Handle boolean values from CSV (which are strings "TRUE"/"FALSE")
                        unread: row.unread?.toString().toUpperCase() === 'TRUE',
                        // Mock avatar data as it's not in the sheet
                        avatar: {
                            src: `https://placehold.co/40x40.png`,
                            fallback: (row.name || 'U').substring(0, 2).toUpperCase(),
                            hint: 'person portrait',
                        },
                    }));
                    resolve(replies);
                },
                error: (error: Error) => {
                    reject(error);
                },
            });
        });
    } catch (error) {
        console.error('Error fetching or parsing replies from Google Sheet:', error);
        // Fallback to an empty array or cached data if fetching fails
        return inMemoryReplies || [];
    }
}


export async function getAllReplies(): Promise<Reply[]> {
    const freshReplies = await fetchRepliesFromSheet();
    inMemoryReplies = freshReplies;
    return freshReplies.sort((a, b) => (b.unread ? 1 : 0) - (a.unread ? 1 : 0));
}

export async function getUnreadRepliesCount(): Promise<number> {
    const replies = await getAllReplies();
    return replies.filter(r => r.unread).length;
}


export async function markAllRepliesAsRead(): Promise<void> {
    // NOTE: This function is now a no-op because we cannot write back to the Google Sheet.
    // The "unread" status is now managed directly in the Google Sheet.
    // We will still revalidate the path to ensure any changes in the sheet are fetched.
    revalidatePath('/', 'layout');
}
