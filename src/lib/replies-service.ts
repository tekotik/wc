
'use server';

import type { Reply } from './mock-data';
import { revalidatePath } from 'next/cache';
import Papa from 'papaparse';

// The correct URL to export the Google Sheet as CSV
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1ZWOfOyo2E_aCUri_Pa8M9D0azFGiaA9fuaszyAdpnfI/export?format=csv&gid=0';

async function fetchAndParseReplies(): Promise<Reply[]> {
  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL, {
      next: { revalidate: 60 }, // Cache for 1 minute
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
        campaignId: row.campaignId || 'unknown',
        name: row.name || `Пользователь ${index + 1}`,
        reply: row.reply || '',
        time: row.time || new Date().toLocaleTimeString(),
        avatar: {
          src: "https://placehold.co/40x40.png",
          fallback: (row.name || 'П').charAt(0).toUpperCase(),
          hint: "person user",
        },
        // The "unread" messages have 'unread' in the unread column
        unread: row.unread === 'unread',
      }))
      .filter(reply => reply.reply && reply.campaignId && reply.campaignId !== 'unknown');

    return replies;

  } catch (error) {
    console.error('Error fetching or parsing Google Sheet:', error);
    return []; // Return empty array on error
  }
}


export async function getAllReplies(): Promise<{ replies: Reply[], lastFetched: Date }> {
    const replies = await fetchAndParseReplies();
    // Return all valid replies
    return { replies, lastFetched: new Date() };
}

export async function getUnreadRepliesCount(): Promise<number> {
  const replies = await fetchAndParseReplies();
  // Count only the ones marked as unread
  return replies.filter(r => r.unread).length;
}

export async function markAllRepliesAsRead(): Promise<void> {
    // This action cannot modify the Google Sheet.
    // It's a conceptual action. The revalidation is what fetches fresh data
    // and makes the app aware of any changes made directly in the sheet.
    // The actual revalidation is now handled in the server action that calls this.
    console.log("Simulating marking all replies as read. Revalidation will occur in the server action.");
}
