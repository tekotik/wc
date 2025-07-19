
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
import { allReplies } from '@/lib/mock-data';
import MonitoringView from './_components/monitoring-view';

export default async function MonitoringPage() {
  const replies = allReplies; // In a real app, you'd fetch this data

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sidebar-foreground"
          >
            <ElsenderLogo className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold font-headline group-data-[collapsible=icon]:hidden">
              Elsender
            </span>
          </Link>
        </SidebarHeader>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="mx-auto w-full max-w-7xl">
            <MonitoringView initialReplies={replies} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
