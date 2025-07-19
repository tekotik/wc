
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
import { getAllReplies } from '@/lib/replies-service';
import RepliesView from './_components/replies-view';
import RepliesPageClient from './_components/replies-page-client';

export const dynamic = 'force-dynamic';

export default async function RepliesPage() {
  const { replies, lastFetched } = await getAllReplies();
  // We'll pass 0 to the Nav components since the client component will handle revalidation
  const unreadCount = 0;

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
        {/* Pass 0 directly as unread count will be reset by the client component action */}
        <SidebarNav unreadCount={unreadCount} />
      </Sidebar>
      <SidebarInset>
        {/* Pass 0 directly */}
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
