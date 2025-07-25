
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
import StatsView from './_components/stats-view';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ElsenderLogo } from '@/components/icons';
import { getUnreadRepliesCount } from '@/lib/replies-service';

export default async function CampaignStatsPage({ params }: { params: { id: string } }) {
  const campaign = await getCampaignById(params.id);
  const unreadCount = await getUnreadRepliesCount();

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
              <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                      <Link href="/campaigns">
                          <ArrowLeft className="h-4 w-4" />
                          <span className="sr-only">Назад</span>
                      </Link>
                  </Button>
                  <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                      Статистика: {campaign.name}
                  </h1>
              </div>
              <StatsView campaign={campaign} />
            </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
