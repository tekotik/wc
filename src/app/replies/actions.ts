
'use server';

import { markAllRepliesAsRead } from "@/lib/replies-service";

export async function markRepliesAsReadAction() {
    await markAllRepliesAsRead();
}
