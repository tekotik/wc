
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { Reply } from './mock-data';
import { allReplies as initialMockReplies } from './mock-data';

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
    return inMemoryReplies;
}

export async function getUnreadRepliesCount(): Promise<number> {
    const replies = await getAllReplies();
    return replies.filter(r => r.unread).length;
}

export async function markAllRepliesAsRead(): Promise<void> {
    let replies = await getAllReplies();
    const updatedReplies = replies.map(reply => ({ ...reply, unread: false }));
    inMemoryReplies = updatedReplies;
    await writeReplies(updatedReplies);
}
