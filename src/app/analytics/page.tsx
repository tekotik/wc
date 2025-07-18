
import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import DashboardHeader from '@/components/dashboard/header';
import AnalyticsOverview from '@/components/dashboard/analytics-overview';
import { getCampaigns } from '@/lib/campaign-service';
import type { Campaign } from '@/lib/mock-data';

export default async function AnalyticsPage() {
  const campaigns = await getCampaigns();
  const completedCampaigns = campaigns.filter(c => c.status === 'Завершена' && c.stats);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
        </SidebarHeader>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <AnalyticsOverview campaigns={completedCampaigns} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
