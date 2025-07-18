import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import DashboardHeader from "@/components/dashboard/header";
import { WappSenderProLogo } from "@/components/icons";
import { getCampaigns } from "@/lib/campaign-service";
import ModerationList from "./_components/moderation-list";


export default async function AdminPage() {
  const allCampaigns = await getCampaigns();
  const moderationCampaigns = allCampaigns.filter(c => c.status === "На модерации");

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
          <ModerationList initialCampaigns={moderationCampaigns} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
