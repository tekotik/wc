
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
import Link from "next/link";
import { ElsenderLogo } from "@/components/icons";

export default async function AnalyticsPage() {
  const campaigns = await getCampaigns();
  const completedCampaigns = campaigns.filter(c => c.status === 'Завершена' && c.stats);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <Link href="/dashboard" className="flex items-center gap-2 text-sidebar-foreground">
            <ElsenderLogo className="w-7 h-7 text-primary" />
            <span className="text-lg font-bold font-headline group-data-[collapsible=icon]:hidden">Elsender</span>
          </Link>
        </SidebarHeader>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
           <div className="max-w-7xl mx-auto w-full">
            <AnalyticsOverview campaigns={completedCampaigns} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
