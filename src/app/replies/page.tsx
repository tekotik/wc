
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
import { getAllReplies, markAllRepliesAsRead, getUnreadRepliesCount } from '@/lib/replies-service';
import RepliesView from './_components/replies-view';

export default async function RepliesPage() {
  // Although this function is currently a no-op, we keep the call
  // in case write-back functionality is added in the future.
  await markAllRepliesAsRead();

  const replies = await getAllReplies(); 
  // After the conceptual "mark as read", the unread count for the nav should be 0.
  const unreadCount = 0;


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
        {/* Pass 0 directly as unread count is reset on this page */}
        <SidebarNav unreadCount={unreadCount} />
      </Sidebar>
      <SidebarInset>
        {/* Pass 0 directly as unread count is reset on this page */}
        <DashboardHeader unreadCount={unreadCount} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="mx-auto w-full max-w-7xl">
            <RepliesView initialReplies={replies} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
