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
import { Button } from "@/components/ui/button";
import { FileText, Pencil, PlusCircle } from "lucide-react";
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
    id: "winter_promo",
    name: "Зимняя акция",
    status: "Завершена",
    text: "Зимняя акция завершена. Спасибо за участие!",
  },
];

export default function CampaignsListPage() {
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline">Все кампании</CardTitle>
                <CardDescription>
                  Просмотр и управление вашими маркетинговыми кампаниями.
                </CardDescription>
              </div>
              <Button asChild>
                <Link href="/campaigns/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Создать кампанию
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} className="transform transition-transform duration-300 ease-out hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-primary" />
                        <div>
                            <CardTitle className="text-lg font-headline">{campaign.name}</CardTitle>
                            <span className={`text-xs font-semibold ${campaign.status === "Активна" ? "text-green-500" : "text-muted-foreground"}`}>{campaign.status}</span>
                        </div>
                      </div>
                       <Button variant="outline" size="sm" asChild>
                            <Link href={`/campaigns/${campaign.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Редактировать
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-card-foreground line-clamp-2">{campaign.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
