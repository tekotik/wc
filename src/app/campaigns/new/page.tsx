"use client";

import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

export default function NewCampaignPage() {
  const [campaignName, setCampaignName] = useState("");
  const [campaignText, setCampaignText] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically handle form submission, e.g., send to an API
    console.log({ campaignName, campaignText });
    toast({
        title: "Кампания создана!",
        description: `Кампания "${campaignName}" была успешно создана.`
    })
  };

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
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                <Link href="/campaigns">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Назад</span>
                </Link>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Создать новую кампанию
            </h1>
          </div>
          <Card>
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle className="font-headline">Новая кампания</CardTitle>
                    <CardDescription>
                        Заполните детали ниже, чтобы создать новую кампанию.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid w-full gap-2">
                        <Label htmlFor="campaignName">Название кампании</Label>
                        <Input 
                            id="campaignName" 
                            placeholder="Например, 'Весенняя распродажа'" 
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            required
                        />
                        </div>
                        <div className="grid w-full gap-2">
                        <Label htmlFor="campaignText">Текст рассылки</Label>
                        <Textarea 
                            id="campaignText" 
                            placeholder="Введите текст вашей рассылки здесь..." 
                            rows={10} 
                            value={campaignText}
                            onChange={(e) => setCampaignText(e.target.value)}
                            required
                        />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Сохранить кампанию
                    </Button>
                </CardFooter>
            </form>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
