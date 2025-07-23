
export const dynamic = 'force-dynamic';

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
import ModerationList from "./_components/moderation-list";
import Link from "next/link";
import { ElsenderLogo } from "@/components/icons";
import { getUnreadRepliesCount } from "@/lib/replies-service";
import CreateCampaignFormForAdmin from "./_components/create-campaign-form-admin";


export default async function AdminPage() {
  const allCampaigns = await getCampaigns();
  const moderationCampaigns = allCampaigns.filter(c => c.status === "На модерации");
  const unreadCount = 0; // Admin doesn't need unread count for user replies


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <Link href="/admin" className="flex items-center gap-2 text-sidebar-foreground">
            <ElsenderLogo className="w-7 h-7 text-primary" />
            <span className="text-lg font-bold font-headline group-data-[collapsible=icon]:hidden">Elsender</span>
          </Link>
        </SidebarHeader>
        <SidebarNav unreadCount={unreadCount} />
      </Sidebar>
      <SidebarInset>
        <DashboardHeader unreadCount={unreadCount} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CreateCampaignFormForAdmin />
            <ModerationList initialCampaigns={moderationCampaigns} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
