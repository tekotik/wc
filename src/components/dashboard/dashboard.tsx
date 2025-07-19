
"use client";

import React, { useState, useMemo } from 'react';
import type { Campaign, Reply } from '@/lib/mock-data';
import ActiveCampaigns from './active-campaigns';
import RecentReplies from './recent-replies';

interface DashboardProps {
    initialCampaigns: Campaign[];
    allReplies: Reply[];
    completedCampaigns: Campaign[];
}

export default function Dashboard({ initialCampaigns, allReplies, completedCampaigns }: DashboardProps) {
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(initialCampaigns.find(c => c.id === 'summer_sale_24')?.id ?? initialCampaigns[0]?.id ?? null);
    
    const handleSelectCampaign = (id: string) => {
        setSelectedCampaignId(id);
    };

    const filteredReplies = useMemo(() => {
        if (!Array.isArray(allReplies)) return [];
        if (!selectedCampaignId) {
            return allReplies.filter(r => r.unread).slice(0, 8); 
        }
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
            // Priority for 'summer_sale_24'
            if (a.id === 'summer_sale_24') return -1;
            if (b.id === 'summer_sale_24') return 1;
            
            // Then sort by unread status
            const aHasUnread = unreadRepliesByCampaign.has(a.id);
            const bHasUnread = unreadRepliesByCampaign.has(b.id);
            if (aHasUnread && !bHasUnread) return -1;
            if (!aHasUnread && bHasUnread) return 1;
            
            return 0; // Keep original order for the rest
        });
    }, [initialCampaigns, unreadRepliesByCampaign]);


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
            <RecentReplies replies={filteredReplies} />
        </div>
      </div>
    );
}
