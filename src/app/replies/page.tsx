
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
import { revalidatePath } from 'next/cache';

export default async function RepliesPage() {
  // Mark all as read when the page is visited
  await markAllRepliesAsRead();
  revalidatePath('/', 'layout'); // Revalidate all pages to update the badge

  const replies = await getAllReplies(); 
  // After visiting this page, the unread count for the nav should be considered 0.
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
