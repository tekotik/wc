

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
            // If no campaign is selected, show a generic set of recent replies or empty
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-7">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <div className="lg:col-span-4">
                  <AnalyticsOverview campaigns={completedCampaigns} />
              </div>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 lg:gap-6">
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
        </div>
      </div>
    );
}
