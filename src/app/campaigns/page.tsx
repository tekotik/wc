
import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import DashboardHeader from "@/components/dashboard/header";
import { getCampaigns } from "@/lib/campaign-service";
import CampaignsList from "./_components/campaigns-list";


export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

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
          <CampaignsList initialCampaigns={campaigns} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
