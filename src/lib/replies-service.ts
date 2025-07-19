'use server';

import type { Reply } from './mock-data';
import { revalidatePath } from 'next/cache';
import Papa from 'papaparse';

// The correct URL to export the Google Sheet as CSV
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1ZWOfOyo2E_aCUri_Pa8M9D0azFGiaA9fuaszyAdpnfI/export?format=csv&gid=0';

async function fetchAndParseReplies(): Promise<Reply[]> {
  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL, {
      next: { revalidate: 600 }, // Cache for 10 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }

    const csvText = await response.text();
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    
    if (parsed.errors.length) {
        console.error("Parsing errors:", parsed.errors);
    }

    const allRows = parsed.data as any[];

    // Transform and filter data
    const replies: Reply[] = allRows
      .map((row, index) => ({
        // Use campaignId from sheet, fallback to a default if needed
        campaignId: row.campaignId || 'Testo', 
        // Use name from sheet, fallback to a default
        name: row.name || `Пользователь ${index + 1}`, 
        reply: row.reply || '',
        // Use time from sheet, format it if necessary
        time: row.time || new Date().toLocaleTimeString(), 
        avatar: {
          src: "https://placehold.co/40x40.png",
          fallback: (row.name || 'П').charAt(0),
          hint: "person user",
        },
        // The "green" messages have 'unread' in the unread column
        unread: row.unread === 'unread',
      }))
      // CRITICAL: Filter out rows without a reply text or campaignId
      .filter(reply => reply.reply && reply.campaignId);

    return replies;

  } catch (error) {
    console.error('Error fetching or parsing Google Sheet:', error);
    return []; // Return empty array on error
  }
}


export async function getAllReplies(): Promise<{ replies: Reply[], lastFetched: Date }> {
    const replies = await fetchAndParseReplies();
    // We only care about the unread ones for display filtering
    const greenReplies = replies.filter(r => r.unread);
    return { replies: greenReplies, lastFetched: new Date() };
}

export async function getUnreadRepliesCount(): Promise<number> {
  const { replies } = await getAllReplies();
  // The function now only returns unread replies, so we can just return the length
  return replies.length;
}

export async function markAllRepliesAsRead(): Promise<void> {
    // This action cannot modify the Google Sheet.
    // Revalidating the path will fetch fresh data.
    revalidatePath('/replies');
    revalidatePath('/dashboard');
}
