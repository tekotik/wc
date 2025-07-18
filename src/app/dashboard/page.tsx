
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import DashboardHeader from "@/components/dashboard/header";
import AiMessageGenerator from "@/components/dashboard/ai-message-generator";
import { getCampaigns } from "@/lib/campaign-service";
import { allReplies } from "@/lib/mock-data";
import Dashboard from "@/components/dashboard/dashboard";
import Link from "next/link";
import { ElsenderLogo } from "@/components/icons";

export default async function DashboardPage() {
  const campaigns = await getCampaigns();
  const activeCampaigns = campaigns.filter(c => c.status === "Активна");
  const hasUnreadReplies = allReplies.some(reply => reply.unread);

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
        <DashboardHeader hasUnreadReplies={hasUnreadReplies} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="max-w-7xl mx-auto w-full flex flex-col gap-4">
            <Dashboard initialCampaigns={activeCampaigns} allReplies={allReplies} />
            <AiMessageGenerator />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
