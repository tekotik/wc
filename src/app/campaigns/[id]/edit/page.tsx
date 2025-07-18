
"use client";

import React, { useState, useEffect } from "react";
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
import { Save, ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { mockCampaigns } from "@/lib/mock-data";


export default function EditCampaignPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<(typeof mockCampaigns)[0] | null>(null);
  
  useEffect(() => {
    // In a real app, you would fetch this data.
    let foundCampaign = mockCampaigns.find(c => c.id === params.id);
    if (foundCampaign) {
      setCampaign(foundCampaign);
    } else {
       toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Рассылка не найдена.",
      });
    }
  }, [params.id, toast]);
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (campaign) {
        // In a real app, you would update the campaign in the DB
        console.log("Saving campaign:", campaign);
        
        let message = `Рассылка "${campaign.name}" сохранена.`;
        if (campaign.status === "Черновик" || campaign.status === "Отклонено") {
           // Simulate sending to moderation
           campaign.status = "На модерации";
           message = `Рассылка "${campaign.name}" отправлена на модерацию.`;
        }

        toast({
            title: "Успех!",
            description: message
        });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (campaign) {
        setCampaign({ ...campaign, [id]: value });
    }
  };

  if (!campaign) {
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
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 justify-center items-center">
                    <p>Загрузка данных рассылки...</p>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
  }

  const isViewOnly = campaign.status === 'Активна' || campaign.status === 'Завершена' || campaign.status === 'На модерации';

  const getButtonContent = () => {
    if (isViewOnly) return null;
    if (campaign.status === 'Отклонено') return { icon: <Send className="mr-2 h-4 w-4" />, text: "Отправить на перемодерацию" };
    if (campaign.status === 'Черновик') return { icon: <Send className="mr-2 h-4 w-4" />, text: "Отправить на модерацию" };
    return { icon: <Save className="mr-2 h-4 w-4" />, text: "Сохранить изменения" };
  }
  
  const buttonContent = getButtonContent();

  const getCardDescription = () => {
    switch (campaign.status) {
        case 'Черновик': return 'Заполните детали рассылки и отправьте ее на модерацию.';
        case 'Отклонено': return 'Внесите правки и отправьте рассылку на повторную модерацию.';
        case 'Активна': return 'Эта рассылка сейчас активна. Редактирование невозможно.';
        case 'Завершена': return 'Эта рассылка завершена. Редактирование невозможно.';
        case 'На модерации': return 'Эта рассылка на модерации. Редактирование временно невозможно.';
        default: return 'Просмотр или редактирование деталей вашей рассылки.';
    }
  }


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
              {isViewOnly ? `Просмотр рассылки` : `Редактировать рассылку`}
            </h1>
          </div>
          <Card>
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle className="font-headline">{campaign.name}</CardTitle>
                    <CardDescription>{getCardDescription()}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid w-full gap-2">
                        <Label htmlFor="name">Название рассылки</Label>
                        <Input 
                            id="name" 
                            placeholder="Например, 'Весенняя распродажа'" 
                            value={campaign.name}
                            onChange={handleInputChange}
                            required
                            disabled={isViewOnly}
                        />
                        </div>
                        <div className="grid w-full gap-2">
                        <Label htmlFor="text">Текст рассылки</Label>
                        <Textarea 
                            id="text" 
                            placeholder="Введите текст вашей рассылки здесь..." 
                            rows={10} 
                            value={campaign.text}
                            onChange={handleInputChange}
                            required
                            disabled={isViewOnly}
                        />
                        </div>
                    </div>
                </CardContent>
                {buttonContent && (
                  <CardFooter>
                      <Button type="submit">
                          {buttonContent.icon}
                          {buttonContent.text}
                      </Button>
                  </CardFooter>
                )}
            </form>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
