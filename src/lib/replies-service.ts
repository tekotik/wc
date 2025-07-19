
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { Reply } from './mock-data';
import { revalidatePath } from 'next/cache';

// Path to the local JSON file
const repliesFilePath = path.join(process.cwd(), 'src', 'lib', 'replies.json');

// In-memory store for replies to avoid reading the file on every call within a single request.
let inMemoryReplies: Reply[] | null = null;

async function readRepliesFromFile(): Promise<Reply[]> {
    try {
        const data = await fs.readFile(repliesFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading replies file:', error);
        return [];
    }
}

async function writeRepliesToFile(replies: Reply[]): Promise<void> {
    try {
        await fs.writeFile(repliesFilePath, JSON.stringify(replies, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing to replies file:', error);
    }
}


export async function getAllReplies(): Promise<Reply[]> {
    // In a real app, you might fetch from a DB here.
    // For this demo, we read from a local JSON file.
    inMemoryReplies = await readRepliesFromFile();
    return inMemoryReplies.sort((a, b) => {
         if (a.unread && !b.unread) return -1;
         if (!a.unread && b.unread) return 1;
         return 0;
    });
}

export async function getUnreadRepliesCount(): Promise<number> {
    const replies = inMemoryReplies || await getAllReplies();
    return replies.filter(r => r.unread).length;
}


export async function markAllRepliesAsRead(): Promise<void> {
    // This function simulates marking all replies as read by updating the JSON file.
    let replies = await readRepliesFromFile();
    let changed = false;
    replies.forEach(reply => {
        if (reply.unread) {
            reply.unread = false;
            changed = true;
        }
    });

    if (changed) {
        await writeRepliesToFile(replies);
        inMemoryReplies = replies;
        // Revalidate all paths that show the unread count
        revalidatePath('/', 'layout');
    }
}
