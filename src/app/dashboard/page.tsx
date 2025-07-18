
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

export default async function DashboardPage() {
  const campaigns = await getCampaigns();
  const activeCampaigns = campaigns.filter(c => c.status === "Активна");
  const hasUnreadReplies = allReplies.some(reply => reply.unread);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           {/* The logo is now in the main DashboardHeader, so we can remove it from here to avoid duplication */}
        </SidebarHeader>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <DashboardHeader hasUnreadReplies={hasUnreadReplies} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Dashboard initialCampaigns={activeCampaigns} allReplies={allReplies} />
          <AiMessageGenerator />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
