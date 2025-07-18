"use client";

import { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import DashboardHeader from "@/components/dashboard/header";
import QuickStats from "@/components/dashboard/quick-stats";
import AnalyticsOverview from "@/components/dashboard/analytics-overview";
import AiMessageGenerator from "@/components/dashboard/ai-message-generator";
import ScheduledMessages from "@/components/dashboard/scheduled-messages";
import RecentReplies from "@/components/dashboard/recent-replies";
import ActiveCampaigns from "@/components/dashboard/active-campaigns";
import { WappSenderProLogo } from "@/components/icons";

export default function Home() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    "summer_sale_24"
  );
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2 justify-center">
            <WappSenderProLogo className="w-7 h-7 text-primary" />
            <h1 className="text-xl font-bold font-headline text-primary">
              WappSender Pro
            </h1>
          </div>
        </SidebarHeader>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <QuickStats />
            </div>
            <div className="lg:col-span-3">
              <RecentReplies selectedCampaignId={selectedCampaignId} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-4">
              <ActiveCampaigns
                selectedCampaignId={selectedCampaignId}
                onSelectCampaign={setSelectedCampaignId}
              />
            </div>
            <div className="lg:col-span-3">
              <ScheduledMessages />
            </div>
          </div>
          <AiMessageGenerator />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
