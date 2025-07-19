
'use server';

import type { Reply } from './mock-data';
import Papa from 'papaparse';
import { revalidatePath } from 'next/cache';

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSgO3kThAbTq2yYVvQMrHfa-4-ISpB1HQyTEP-hAsoVpM_f_5rVT5yQk52eI84K9u25sQeysANtLgL2/pub?gid=0&single=true&output=csv';

interface SheetRow {
  campaignId: string;
  name: string;
  reply: string;
  time: string;
  avatar_src: string;
  avatar_fallback: string;
  avatar_hint: string;
  unread: string; // Comes as string 'unread' or 'read'
}


export async function getAllReplies(): Promise<{ replies: Reply[], lastFetched: Date }> {
  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL, {
      next: { revalidate: 600 } // Revalidate every 10 minutes
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch spreadsheet: ${response.statusText}`);
    }

    const csvText = await response.text();
    
    const parsed = Papa.parse<SheetRow>(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    
    if (parsed.errors.length) {
        console.error("Parsing errors:", parsed.errors);
    }
    
    const allRepliesData = parsed.data;

    const unreadReplies = allRepliesData
      .filter(row => row.unread === 'unread' && row.reply)
      .map(row => ({
        campaignId: row.campaignId,
        name: row.name,
        reply: row.reply,
        time: row.time,
        avatar: {
          src: row.avatar_src,
          fallback: row.avatar_fallback,
          hint: row.avatar_hint,
        },
        unread: true,
      }));

    return { replies: unreadReplies, lastFetched: new Date() };

  } catch (error) {
    console.error('Error fetching or parsing replies from Google Sheet:', error);
    return { replies: [], lastFetched: new Date() }; // Return empty array on error
  }
}

export async function getUnreadRepliesCount(): Promise<number> {
    const { replies } = await getAllReplies();
    // Since getAllReplies now only returns unread ones, the count is just the length.
    return replies.length;
}


export async function markAllRepliesAsRead(): Promise<void> {
    // This function is now a placeholder.
    // With Google Sheets as a data source, we can't "write" back to mark them as read.
    // The "unread" status is managed directly in the Google Sheet.
    // We will still revalidate the path to ensure any changes in the sheet are fetched.
     revalidatePath('/replies');
}
