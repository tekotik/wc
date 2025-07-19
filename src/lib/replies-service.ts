
'use server';

import type { Reply } from './mock-data';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

// Use the local JSON file as the source of truth for replies.
const repliesFilePath = path.join(process.cwd(), 'src', 'lib', 'replies.json');

async function readRepliesFromFile(): Promise<Reply[]> {
  try {
    const data = await fs.readFile(repliesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading replies file:', error);
    return [];
  }
}

async function writeReplies(replies: Reply[]): Promise<void> {
  try {
    await fs.writeFile(repliesFilePath, JSON.stringify(replies, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to replies file:', error);
  }
}

export async function getAllReplies(): Promise<{ replies: Reply[], lastFetched: Date }> {
  try {
    const replies = await readRepliesFromFile();
    return { replies, lastFetched: new Date() };
  } catch (error) {
    console.error('Error fetching or parsing replies:', error);
    return { replies: [], lastFetched: new Date() };
  }
}

export async function getUnreadRepliesCount(): Promise<number> {
  const { replies } = await getAllReplies();
  return replies.filter(reply => reply.unread).length;
}

export async function markAllRepliesAsRead(): Promise<void> {
  let { replies } = await getAllReplies();
  replies.forEach(reply => {
    reply.unread = false;
  });
  await writeReplies(replies);
  // Revalidate paths that show the unread count or the list of replies.
  revalidatePath('/replies');
  revalidatePath('/dashboard');
}
