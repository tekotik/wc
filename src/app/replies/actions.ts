
'use server';

import { getRepliesFromCsvUrl, markAllRepliesAsRead } from "@/lib/replies-service";
import type { Reply } from '@/lib/mock-data';

export async function markRepliesAsReadAction() {
    await markAllRepliesAsRead();
}

export async function loadRepliesFromUrlAction(url: string): Promise<{ success: boolean; replies?: Reply[]; error?: string }> {
    if (!url || !url.startsWith('https://')) {
        return { success: false, error: 'Пожалуйста, введите действительный HTTPS URL.' };
    }

    try {
        const { replies } = await getRepliesFromCsvUrl(url);
        return { success: true, replies: replies };
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка.";
        return { success: false, error: errorMessage };
    }
}
