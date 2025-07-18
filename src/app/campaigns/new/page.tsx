
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Send, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

function NewCampaignContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messages = searchParams.get('messages');
  
  const [campaignName, setCampaignName] = useState("");
  const [campaignText, setCampaignText] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    if (messages) {
      setCampaignName(`Рассылка на ${messages} сообщений`);
    } else {
      router.push('/campaigns');
       toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, сначала выберите пакет сообщений.",
      });
    }
  }, [messages, router, toast]);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Sending for moderation:", { campaignName, campaignText });
    toast({
        title: "Рассылка отправлена на модерацию!",
        description: `Рассылка "${campaignName}" будет рассмотрена в ближайшее время.`
    });
    router.push('/campaigns');
  };

  if (!messages) {
    return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/campaigns">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Назад</span>
            </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Создать новую рассылку
        </h1>
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
            <CardHeader>
                <CardTitle className="font-headline">Новая рассылка</CardTitle>
                <CardDescription>
                    Вы выбрали пакет на {messages} сообщений. Заполните детали и отправьте рассылку на модерацию.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid w-full gap-2">
                    <Label htmlFor="campaignName">Название рассылки</Label>
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
                    <Send className="mr-2 h-4 w-4" />
                    Отправить на модерацию
                </Button>
            </CardFooter>
        </form>
      </Card>
    </main>
  );
}


export default function NewCampaignPage() {
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
        <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <NewCampaignContent />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
