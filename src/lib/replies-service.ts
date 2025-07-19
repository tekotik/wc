
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { Reply } from './mock-data';
import { allReplies as initialMockReplies } from './mock-data';
import { revalidatePath } from 'next/cache';

// Note: In a real-world application, you would use a proper database.
const repliesFilePath = path.join(process.cwd(), 'src', 'lib', 'replies.json');

// In-memory store for replies, primarily for Vercel's read-only filesystem.
let inMemoryReplies: Reply[] | null = null;

async function readRepliesFromFile(): Promise<Reply[]> {
  try {
    const data = await fs.readFile(repliesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      await writeReplies(initialMockReplies);
      return initialMockReplies;
    }
    console.error('Error reading replies file:', error);
    return initialMockReplies;
  }
}

async function writeReplies(replies: Reply[]): Promise<void> {
    try {
        await fs.writeFile(repliesFilePath, JSON.stringify(replies, null, 2), 'utf-8');
    } catch (error) {
        // This might fail on read-only filesystems like Vercel.
    }
}

export async function getAllReplies(): Promise<Reply[]> {
    if (inMemoryReplies === null) {
      inMemoryReplies = await readRepliesFromFile();
    }
    return inMemoryReplies.sort((a, b) => (b.unread ? 1 : 0) - (a.unread ? 1 : 0));
}

export async function getUnreadRepliesCount(): Promise<number> {
    const replies = await getAllReplies();
    return replies.filter(r => r.unread).length;
}

export async function markAllRepliesAsRead(): Promise<void> {
    let replies = await getAllReplies();
    const wereThereUnread = replies.some(r => r.unread);

    // Only proceed if there are actual unread messages to avoid unnecessary writes/revalidations
    if (!wereThereUnread) {
        return;
    }

    const updatedReplies = replies.map(reply => ({ ...reply, unread: false }));
    
    // Update the in-memory cache first
    inMemoryReplies = updatedReplies;
    
    // Then attempt to write to the file
    await writeReplies(updatedReplies);
    
    // Revalidate the entire site to update the notification badge everywhere
    revalidatePath('/', 'layout');
}
