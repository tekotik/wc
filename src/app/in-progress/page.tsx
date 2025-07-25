

import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import DashboardHeader from "@/components/dashboard/header";
import Link from "next/link";
import { ElsenderLogo } from "@/components/icons";
import { getUnreadRepliesCount } from "@/lib/replies-service";
import InProgressList from "./_components/in-progress-list";
import { getCampaigns } from "@/lib/campaign-service";


export const dynamic = 'force-dynamic';

export default async function InProgressPage() {
  const unreadCount = await getUnreadRepliesCount();
  const allCampaigns = await getCampaigns();

  // Filter campaigns that should be displayed on the "In Progress" page
  // For admins, this shows all. For users, it will be filtered by their ID in getCampaigns.
  const inProgressCampaigns = allCampaigns.filter(c => 
    c.status === "Активна" || 
    c.status === "Завершена"
  );


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <Link href="/dashboard" className="flex items-center gap-2 text-sidebar-foreground">
            <ElsenderLogo className="w-7 h-7 text-primary" />
            <span className="text-lg font-bold font-headline group-data-[collapsible=icon]:hidden">Elsender</span>
          </Link>
        </SidebarHeader>
        <SidebarNav unreadCount={unreadCount} />
      </Sidebar>
      <SidebarInset>
        <DashboardHeader unreadCount={unreadCount} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="max-w-7xl mx-auto w-full">
            <InProgressList initialCampaigns={inProgressCampaigns} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
