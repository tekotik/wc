
'use server';

import type { Reply, Campaign } from './mock-data';
import Papa from 'papaparse';
import { getCampaigns } from './campaign-service';
import { getSession } from './session';

// The correct URL to export the Google Sheet as CSV
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTAt0QszK6G1ERwuRNwMsdCWzDPrUkL8wqEELkJaUT8mi6VtcPaDlC0bXWqiIt9Vbgu3ehIAgB0i2pc/pub?output=csv';


async function fetchAndParseReplies(url: string | null): Promise<Reply[]> {
  // If no URL is provided, return an empty array immediately.
  if (!url) {
      return [];
  }

  try {
    // Add { cache: 'no-store' } to prevent Next.js from caching the fetch request
    const response = await fetch(url, { next: { revalidate: 60 } });

    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }

    const csvText = await response.text();
    // Parse without headers to rely on column index
    const parsed = Papa.parse(csvText, {
      skipEmptyLines: true,
    });
    
    if (parsed.errors.length) {
        console.error("Parsing errors:", parsed.errors);
    }

    const allRows = parsed.data as string[][];

    // Transform and filter data, skipping the header row
    const replies: Reply[] = allRows
      .slice(1) // Skip header row
      .map((row, index) => ({
        // Assuming columns are: campaignId, name, reply, time, unread
        campaignId: row[0] || 'default_campaign',
        name: row[1] || `Пользователь ${index + 1}`,
        reply: row[2] || '',
        time: row[3] || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: {
          src: "https://placehold.co/40x40.png",
          fallback: (row[1] || 'П').charAt(0).toUpperCase(),
          hint: "person user",
        },
        unread: row[4]?.toLowerCase() === 'true' || row[4]?.toLowerCase() === 'unread',
      }))
      .filter(reply => reply.reply); // Filter out rows with empty replies

    return replies.reverse(); // Show newest replies first

  } catch (error) {
    console.error(`Error fetching or parsing CSV from ${url}:`, error);
    if (error instanceof Error) {
        throw new Error(`Не удалось загрузить или обработать CSV: ${error.message}`);
    }
    throw new Error('Произошла неизвестная ошибка при обработке CSV.');
  }
}

export async function getRepliesFromCsvUrl(url: string | null): Promise<{ replies: Reply[] }> {
    try {
        const replies = await fetchAndParseReplies(url);
        return { replies };
    } catch (error) {
        // Re-throwing the error to be caught by the action
        throw error;
    }
}

async function getRepliesForCurrentUser(): Promise<Reply[]> {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId) {
        return [];
    }
    
    const userCampaigns = await getCampaigns(); // getCampaigns is already role-aware
    const campaignReplyUrls = userCampaigns
      .map(c => c.repliesCsvUrl)
      .filter((url): url is string => !!url);
    
    const uniqueUrls = [...new Set(campaignReplyUrls)];
    
    const allReplies = await Promise.all(
      uniqueUrls.map(url => fetchAndParseReplies(url))
    );
    
    return allReplies.flat();
}


export async function getAllReplies(): Promise<{ replies: Reply[], lastFetched: Date }> {
    const replies = await getRepliesForCurrentUser();
    return { replies, lastFetched: new Date() };
}

export async function getUnreadRepliesCount(): Promise<number> {
  const replies = await getRepliesForCurrentUser();
  return replies.filter(r => r.unread).length;
}

export async function markAllRepliesAsRead(): Promise<void> {
    console.log("Simulating marking all replies as read. This is a mock action.");
}
