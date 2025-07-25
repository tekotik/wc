

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import DashboardHeader from "@/components/dashboard/header";
import { getCampaigns } from "@/lib/campaign-service";
import { getAllReplies, getUnreadRepliesCount } from "@/lib/replies-service";
import Dashboard from "@/components/dashboard/dashboard";
import Link from "next/link";
import { ElsenderLogo } from "@/components/icons";
import React from 'react';
import { getSession } from "@/lib/session";
import WelcomeDashboard from "@/components/dashboard/welcome-dashboard";

// Force dynamic rendering to ensure fresh data on each request.
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session.isLoggedIn || !session.userId) {
     // This case should be handled by middleware, but as a fallback:
    return null; // or a redirect
  }
  
  const campaigns = await getCampaigns();
  const { replies: allReplies } = await getAllReplies();
  const activeCampaigns = campaigns.filter(c => c.status === "Активна");
  const completedCampaigns = campaigns.filter(c => c.status === 'Завершена' && c.stats);
  const unreadCount = await getUnreadRepliesCount();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2 text-sidebar-foreground">
            <ElsenderLogo className="w-7 h-7 text-primary" />
            <span className="text-lg font-bold font-headline group-data-[collapsible=icon]:hidden">Elsender</span>
          </Link>
        </SidebarHeader>
        <SidebarNav unreadCount={unreadCount} />
      </Sidebar>
      <SidebarInset>
        <DashboardHeader unreadCount={unreadCount} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="max-w-7xl mx-auto w-full flex flex-col gap-4">
            {campaigns.length === 0 ? (
                <WelcomeDashboard />
            ) : (
                <Dashboard initialCampaigns={activeCampaigns} allReplies={allReplies} completedCampaigns={completedCampaigns} />
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
