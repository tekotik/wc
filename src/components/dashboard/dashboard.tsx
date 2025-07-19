
"use client";

import React, { useState, useMemo } from 'react';
import type { Campaign, Reply } from '@/lib/mock-data';
import ActiveCampaigns from './active-campaigns';
import RecentReplies from './recent-replies';
import AnalyticsOverview from './analytics-overview';

interface DashboardProps {
    initialCampaigns: Campaign[];
    allReplies: Reply[];
    completedCampaigns: Campaign[];
}

export default function Dashboard({ initialCampaigns, allReplies, completedCampaigns }: DashboardProps) {
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(initialCampaigns[0]?.id ?? null);
    
    const handleSelectCampaign = (id: string) => {
        setSelectedCampaignId(id);
    };

    const filteredReplies = useMemo(() => {
        if (!selectedCampaignId) {
            return allReplies.filter(r => r.unread).slice(0, 8); 
        }
        return allReplies.filter(reply => reply.campaignId === selectedCampaignId);
    }, [selectedCampaignId, allReplies]);

    const unreadRepliesByCampaign = useMemo(() => {
        const unreadMap = new Map<string, number>();
        allReplies.forEach(reply => {
            if(reply.unread) {
                unreadMap.set(reply.campaignId, (unreadMap.get(reply.campaignId) || 0) + 1);
            }
        });
        return unreadMap;
    }, [allReplies]);


    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 lg:gap-6">
        <div className="lg:col-span-7">
            <AnalyticsOverview campaigns={completedCampaigns} />
        </div>
        <div className="lg:col-span-3">
            <ActiveCampaigns 
                campaigns={initialCampaigns}
                selectedCampaignId={selectedCampaignId}
                onSelectCampaign={handleSelectCampaign}
                unreadReplies={unreadRepliesByCampaign}
            />
        </div>
        <div className="lg:col-span-4">
            <RecentReplies replies={filteredReplies} />
        </div>
      </div>
    );
}
