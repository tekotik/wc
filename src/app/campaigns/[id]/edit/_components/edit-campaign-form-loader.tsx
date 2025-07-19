
"use client";

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import type { Campaign } from '@/lib/mock-data';
import EditCampaignForm from './edit-campaign-form';

export default function EditCampaignFormLoader({ campaignId }: { campaignId: string }) {
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const pendingCampaignData = localStorage.getItem('pendingCampaign');
        if (pendingCampaignData) {
            try {
                const pendingCampaign = JSON.parse(pendingCampaignData);
                if (pendingCampaign.id === campaignId) {
                    setCampaign(pendingCampaign);
                    // Clear the item so it's only used once
                    localStorage.removeItem('pendingCampaign');
                }
            } catch (e) {
                console.error("Failed to parse pending campaign from localStorage", e);
                localStorage.removeItem('pendingCampaign');
            }
        }
        setIsLoading(false);
    }, [campaignId]);

    if (isLoading) {
        // You can return a skeleton loader here if you want
        return <div>Loading...</div>;
    }

    if (!campaign) {
        // If still no campaign, then it's a real 404
        notFound();
    }

    return <EditCampaignForm campaign={campaign} />;
}
