
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
import { getAllReplies, getUnreadRepliesCount } from '@/lib/replies-service';
import RepliesView from './_components/replies-view';
import RepliesPageClient from './_components/replies-page-client';

export const dynamic = 'force-dynamic';

export default async function RepliesPage() {
  const { replies, lastFetched } = await getAllReplies();
  // We get the count before "marking as read" on the client
  const unreadCount = await getUnreadRepliesCount();

  return (
    <SidebarProvider>
      {/* This client component will trigger the action to mark replies as read */}
      <RepliesPageClient />
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
        {/* Pass the initial unread count, the client will re-render and update this via revalidation */}
        <SidebarNav unreadCount={unreadCount} />
      </Sidebar>
      <SidebarInset>
        <DashboardHeader unreadCount={unreadCount} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="mx-auto w-full max-w-7xl">
            <RepliesView initialReplies={replies} lastFetched={lastFetched} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
