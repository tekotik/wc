
"use client";

import React, { useState, useMemo } from 'react';
import type { Campaign, Reply } from '@/lib/mock-data';
import ActiveCampaigns from './active-campaigns';
import RecentReplies from './recent-replies';
import CreateCampaignForm from './create-campaign-form';

interface DashboardProps {
    initialCampaigns: Campaign[];
    allReplies: Reply[];
    completedCampaigns: Campaign[];
}

export default function Dashboard({ initialCampaigns, allReplies, completedCampaigns }: DashboardProps) {
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
    
    const handleSelectCampaign = (id: string) => {
        // Toggle selection off if the same campaign is clicked again
        setSelectedCampaignId(prevId => prevId === id ? null : id);
    };

    const filteredReplies = useMemo(() => {
        if (!Array.isArray(allReplies)) return [];
        if (!selectedCampaignId) {
            // If no campaign is selected, show the 8 most recent replies from all campaigns.
            return allReplies.slice(0, 8);
        }
        // If a campaign is selected, filter replies for that campaign.
        return allReplies.filter(reply => reply.campaignId === selectedCampaignId);
    }, [selectedCampaignId, allReplies]);

    const unreadRepliesByCampaign = useMemo(() => {
        if (!Array.isArray(allReplies)) return new Map<string, number>();
        const unreadMap = new Map<string, number>();
        allReplies.forEach(reply => {
            if(reply.unread) {
                unreadMap.set(reply.campaignId, (unreadMap.get(reply.campaignId) || 0) + 1);
            }
        });
        return unreadMap;
    }, [allReplies]);
    
    const totalRepliesByCampaign = useMemo(() => {
        if (!Array.isArray(allReplies)) return new Map<string, number>();
        const totalMap = new Map<string, number>();
        allReplies.forEach(reply => {
            totalMap.set(reply.campaignId, (totalMap.get(reply.campaignId) || 0) + 1);
        });
        return totalMap;
    }, [allReplies]);

    const sortedCampaigns = useMemo(() => {
        if (!Array.isArray(initialCampaigns)) return [];
        return [...initialCampaigns].sort((a, b) => {
            // Priority for campaigns with unread messages
            const aHasUnread = unreadRepliesByCampaign.has(a.id);
            const bHasUnread = unreadRepliesByCampaign.has(b.id);
            if (aHasUnread && !bHasUnread) return -1;
            if (!aHasUnread && bHasUnread) return 1;
            
            // Then sort by total replies (more replies higher)
            const aReplies = totalRepliesByCampaign.get(a.id) || 0;
            const bReplies = totalRepliesByCampaign.get(b.id) || 0;
            if (aReplies !== bReplies) return bReplies - aReplies;

            return 0; // Keep original order for the rest
        });
    }, [initialCampaigns, unreadRepliesByCampaign, totalRepliesByCampaign]);


    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 lg:gap-6">
        <div className="lg:col-span-3">
            <ActiveCampaigns 
                campaigns={sortedCampaigns}
                selectedCampaignId={selectedCampaignId}
                onSelectCampaign={handleSelectCampaign}
                totalReplies={totalRepliesByCampaign}
            />
        </div>
        <div className="lg:col-span-4">
            <RecentReplies replies={filteredReplies} selectedCampaignId={selectedCampaignId} />
        </div>
      </div>
    );
}
