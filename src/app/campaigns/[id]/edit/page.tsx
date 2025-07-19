
import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import DashboardHeader from '@/components/dashboard/header';
import { notFound } from 'next/navigation';
import { getCampaignById } from '@/lib/campaign-service';
import EditCampaignForm from './_components/edit-campaign-form';
import Link from "next/link";
import { ElsenderLogo } from "@/components/icons";
import EditCampaignFormLoader from './_components/edit-campaign-form-loader';

export default async function EditCampaignPage({ params }: { params: { id: string } }) {
  const campaign = await getCampaignById(params.id);

  // If the campaign is not found on the server,
  // the loader component will try to find it in localStorage on the client.
  if (!campaign) {
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
            <div className="max-w-7xl mx-auto w-full flex flex-col gap-4">
               <EditCampaignFormLoader campaignId={params.id} />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    )
  }

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
          <div className="max-w-7xl mx-auto w-full flex flex-col gap-4">
            <EditCampaignForm campaign={campaign} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
