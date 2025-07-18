
"use client";

import React, { useState, useMemo } from 'react';
import type { Campaign, Reply } from '@/lib/mock-data';
import ActiveCampaigns from './active-campaigns';
import RecentReplies from './recent-replies';

interface DashboardProps {
    initialCampaigns: Campaign[];
    allReplies: Reply[];
}

export default function Dashboard({ initialCampaigns, allReplies }: DashboardProps) {
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(initialCampaigns[0]?.id ?? null);
    
    const handleSelectCampaign = (id: string) => {
        setSelectedCampaignId(id);
    };

    const filteredReplies = useMemo(() => {
        if (!selectedCampaignId) {
            // If no campaign is selected, show a generic set of recent replies or empty
            return allReplies.slice(0, 8); 
        }
        return allReplies.filter(reply => reply.campaignId === selectedCampaignId);
    }, [selectedCampaignId, allReplies]);

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 lg:gap-6">
            <div className="lg:col-span-3">
                <ActiveCampaigns 
                    campaigns={initialCampaigns}
                    selectedCampaignId={selectedCampaignId}
                    onSelectCampaign={handleSelectCampaign}
                />
            </div>
            <div className="lg:col-span-4">
                <RecentReplies replies={filteredReplies} />
            </div>
        </div>
    );
}
