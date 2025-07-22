
import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import DashboardHeader from "@/components/dashboard/header";
import Link from "next/link";
import { ElsenderLogo } from "@/components/icons";
import { getUnreadRepliesCount } from "@/lib/replies-service";
import InProgressList from "./_components/in-progress-list";
import type { Campaign } from "@/lib/mock-data";


const exampleCampaigns: Campaign[] = [
    {
        id: "in_progress_1",
        name: "Весенняя акция для клиентов",
        status: "Активна",
        text: "Рассылка запущена и отправляется клиентам.",
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    },
    {
        id: "in_progress_2",
        name: "Опрос удовлетворенности",
        status: "Отклонено", // Using "Отклонено" to represent "Остановлена"
        text: "Рассылка была остановлена вручную."
    },
    {
        id: "in_progress_3",
        name: "Информирование о новых функциях",
        status: "Завершена",
        text: "Все сообщения были успешно отправлены."
    }
]


export default async function InProgressPage() {
  const unreadCount = await getUnreadRepliesCount();

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
          <div className="max-w-7xl mx-auto w-full">
            <InProgressList initialCampaigns={exampleCampaigns} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
