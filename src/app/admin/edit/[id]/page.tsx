
import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import DashboardHeader from '@/components/dashboard/header';
import Link from 'next/link';
import { ElsenderLogo } from '@/components/icons';
import { getUnreadRepliesCount } from '@/lib/replies-service';
import { getCampaignById } from '@/lib/campaign-service';
import AdminEditCampaignForm from './_components/admin-edit-campaign-form';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminEditCampaignPage({ params }: { params: { id: string } }) {
  const unreadCount = await getUnreadRepliesCount();
  const campaign = await getCampaignById(params.id);

  if (!campaign) {
    notFound();
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
        <SidebarNav unreadCount={unreadCount} />
      </Sidebar>
      <SidebarInset>
        <DashboardHeader unreadCount={unreadCount} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="max-w-7xl mx-auto w-full flex flex-col gap-4">
            <AdminEditCampaignForm campaign={campaign} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
