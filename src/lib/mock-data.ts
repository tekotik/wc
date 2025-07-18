export type CampaignStatus = "Черновик" | "На модерации" | "Одобрено" | "Отклонено" | "Активна" | "Завершена";

export interface Campaign {
    id: string;
    name: string;
    status: CampaignStatus;
    text: string;
    rejectionReason?: string;
}

// This data is now seeded into campaigns.json and this file is no longer the source of truth.
// It is kept for type definitions.
export const mockCampaigns: Campaign[] = [];
