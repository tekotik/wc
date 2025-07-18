
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import DashboardHeader from "@/components/dashboard/header";
import AiMessageGenerator from "@/components/dashboard/ai-message-generator";
import ActiveCampaigns from "@/components/dashboard/active-campaigns";
import { WappSenderProLogo } from "@/components/icons";
import RecentReplies from "@/components/dashboard/recent-replies";
import { getCampaigns } from "@/lib/campaign-service";

export default async function Home() {
  const campaigns = await getCampaigns();
  const activeCampaigns = campaigns.filter(c => c.status === "Активна");

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2 justify-center">
            <WappSenderProLogo className="w-7 h-7 text-primary" />
            <h1 className="text-xl font-bold font-headline text-primary">
              WappSender Pro
            </h1>
          </div>
        </SidebarHeader>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
           <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 lg:gap-6">
            <div className="lg:col-span-3">
              <ActiveCampaigns initialCampaigns={activeCampaigns} />
            </div>
            <div className="lg:col-span-4">
               {/* This component will now manage its own state */}
               <RecentReplies />
            </div>
          </div>
          <AiMessageGenerator />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
