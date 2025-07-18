import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import DashboardHeader from "@/components/dashboard/header";
import { WappSenderProLogo } from "@/components/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function CampaignsPage() {
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
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Создать рассылку</CardTitle>
              <CardDescription>
                Напишите текст вашей рассылки и отправьте его на модерацию.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full gap-2">
                  <Label htmlFor="message">Текст рассылки</Label>
                  <Textarea id="message" placeholder="Введите текст вашей рассылки здесь..." rows={10} />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Отправить на модерацию
              </Button>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
