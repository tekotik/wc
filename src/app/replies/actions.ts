
'use server';

import { markAllRepliesAsRead } from "@/lib/replies-service";
import { revalidatePath } from 'next/cache';

export async function markRepliesAsReadAction() {
    await markAllRepliesAsRead();
    // Revalidate all paths that show the unread count
    revalidatePath('/dashboard');
    revalidatePath('/replies');
}
