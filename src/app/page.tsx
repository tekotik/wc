import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import DashboardHeader from "@/components/dashboard/header";
import QuickStats from "@/components/dashboard/quick-stats";
import AnalyticsOverview from "@/components/dashboard/analytics-overview";
import AiMessageGenerator from "@/components/dashboard/ai-message-generator";
import ScheduledMessages from "@/components/dashboard/scheduled-messages";
import { WappSenderProLogo } from "@/components/icons";

export default function Home() {
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
            <QuickStats />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="lg:col-span-4">
                    <AnalyticsOverview />
                </div>
                <div className="lg:col-span-3">
                    <ScheduledMessages />
                </div>
            </div>
            <AiMessageGenerator />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
