
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Ban, Link as LinkIcon, Calendar, List, Clock, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Campaign, CampaignStatus } from "@/lib/mock-data";
import { Separator } from "@/components/ui/separator";

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft: { [key: string]: number } = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const formatSegment = (value: number) => String(value).padStart(2, '0');

    if (Object.keys(timeLeft).length === 0) {
        return <span>00:00:00</span>;
    }

    return (
        <span>
            {timeLeft.days > 0 ? `${timeLeft.days}д ` : ''}
            {formatSegment(timeLeft.hours)}:{formatSegment(timeLeft.minutes)}:{formatSegment(timeLeft.seconds)}
        </span>
    );
};

const statusConfig: Record<string, {
    badgeClass: string,
    label: string,
    actions: React.ReactNode,
    details: (campaign: Campaign) => React.ReactNode,
}> = {
    "Активна": {
        badgeClass: "bg-green-100 text-green-800 border-green-200",
        label: "Запущена",
        actions: (
            <>
                <Button variant="ghost" size="icon"><Pause className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Ban className="h-4 w-4" /></Button>
            </>
        ),
        details: (campaign) => (
             <>
                {campaign.scheduledAt && <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><CountdownTimer targetDate={campaign.scheduledAt} /></div>}
            </>
        )
    },
    "Отклонено": { // Representing "Остановлена"
        badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Остановлена",
        actions: (
             <>
                <Button variant="ghost" size="icon"><Play className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Ban className="h-4 w-4" /></Button>
            </>
        ),
        details: () => null,
    },
    "Завершена": {
        badgeClass: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Завершена",
        actions: <Button variant="ghost" size="icon"><List className="h-4 w-4" /></Button>,
         details: () => (
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Итог: 00:02:03</span>
            </div>
        )
    },
};

const getMessageCount = (text: string) => {
    const match = text.match(/Рассылка на (\d+) сообщений/);
    return match ? match[1] : 'N/A';
};

interface InProgressListProps {
    initialCampaigns: Campaign[];
}

export default function InProgressList({ initialCampaigns }: InProgressListProps) {
  return (
    <>
      <div className="flex items-center gap-3">
          <History className="h-8 w-8 text-primary" />
          <div>
              <h1 className="text-2xl font-bold font-headline">Рассылки в работе</h1>
              <p className="text-muted-foreground">
                  Здесь находятся все ваши запущенные, остановленные и завершенные рассылки.
              </p>
          </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {initialCampaigns.map((campaign) => {
          const config = statusConfig[campaign.status] || statusConfig["Активна"];
          const messageCount = getMessageCount(campaign.text);
          const scheduledDate = campaign.scheduledAt ? new Date(campaign.scheduledAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';
          
          return (
            <Card key={campaign.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="font-headline text-lg">{campaign.name}</CardTitle>
                    <Badge variant="outline" className={config.badgeClass}>{config.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-2 text-sm">
                <div className="flex items-center gap-2">
                    <List className="h-4 w-4 text-muted-foreground" />
                    <span>{messageCount} сообщений</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{scheduledDate.replace(' в',',')}</span>
                </div>
                {config.details(campaign)}
              </CardContent>
              <CardFooter className="flex-col items-start p-0">
                  <Separator className="mb-2" />
                  <div className="flex items-center justify-between w-full px-4 pb-2">
                      <Button variant="link" className="p-0 h-auto">
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Получить ссылку
                      </Button>
                      <div className="flex items-center">
                        {config.actions}
                      </div>
                  </div>
              </CardFooter>
            </Card>
          )
        })}
        {initialCampaigns.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
                <History className="mx-auto h-12 w-12" />
                <h3 className="mt-2 text-lg font-semibold">Рассылок в работе нет</h3>
                <p className="mt-1 text-sm">Начните с создания новой рассылки на панели управления.</p>
            </div>
          )}
      </div>
    </>
  );
}
