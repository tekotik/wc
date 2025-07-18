
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

// Mock data for campaigns
const campaigns = [
  {
    id: "summer_sale_24",
    name: "Летняя распродажа '24",
    status: "Активна",
    text: "Не пропустите нашу летнюю распродажу! Скидки до 50% на весь ассортимент. Только до конца недели!",
  },
  {
    id: "new_collection_24",
    name: "Новая коллекция",
    status: "Активна",
    text: "Встречайте нашу новую коллекцию! Стильные новинки уже ждут вас. Посмотрите первыми!",
  },
  {
    id: "loyalty_program",
    name: "Программа лояльности",
    status: "Активна",
    text: "Присоединяйтесь к нашей программе лояльности и получайте эксклюзивные скидки и бонусы!",
  },
   {
    id: "promo_action_test",
    name: "Тестовая промо-акция",
    status: "Отклонено",
    text: "Наша тестовая промо-акция...",
    rejectionReason: "Не указана целевая аудитория."
  },
  {
    id: "winter_promo",
    name: "Зимняя акция",
    status: "Завершена",
    text: "Зимняя акция завершена. Спасибо за участие!",
  },
  {
    id: "draft_campaign_1",
    name: "Новая рассылка (Черновик)",
    status: "Черновик",
    text: "",
  },
];

export default function EditCampaignPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<{id: string; name: string; text: string, status: string, rejectionReason?: string} | null>(null);
  
  useEffect(() => {
    // In a real app, you would fetch this data.
    // Here we find it or create a mock for new drafts.
    let foundCampaign = campaigns.find(c => c.id === params.id);
    if (foundCampaign) {
      setCampaign(foundCampaign as any);
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
        console.log("Saving campaign:", campaign);
        // In a real app, you would update the campaign status to "On Moderation"
        toast({
            title: "Рассылка обновлена!",
            description: `Рассылка "${campaign.name}" отправлена на модерацию.`
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

  const isRejected = campaign.status === 'Отклонено';
  const isDraft = campaign.status === 'Черновик';

  const getButtonContent = () => {
    if (isRejected) return { icon: <Send className="mr-2 h-4 w-4" />, text: "Отправить на перемодерацию" };
    if (isDraft) return { icon: <Send className="mr-2 h-4 w-4" />, text: "Отправить на модерацию" };
    return { icon: <Save className="mr-2 h-4 w-4" />, text: "Сохранить изменения" };
  }

  const { icon, text } = getButtonContent();

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
              Редактировать рассылку
            </h1>
          </div>
          <Card>
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle className="font-headline">{campaign.name}</CardTitle>
                    <CardDescription>
                        {isRejected 
                            ? "Внесите правки и отправьте рассылку на повторную модерацию." 
                            : isDraft
                            ? "Заполните детали рассылки и отправьте ее на модерацию."
                            : "Измените детали вашей рассылки и сохраните изменения."
                        }
                    </CardDescription>
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
                        />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit">
                        {icon}
                        {text}
                    </Button>
                </CardFooter>
            </form>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
