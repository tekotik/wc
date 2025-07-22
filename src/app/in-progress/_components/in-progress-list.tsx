
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle, CheckCircle2, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Campaign, CampaignStatus } from "@/lib/mock-data";

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

    const timerComponents = Object.keys(timeLeft).map((interval) => {
        if (!timeLeft[interval as keyof typeof timeLeft] && ['days', 'hours', 'minutes'].includes(interval)) {
            return null;
        }
        const unit = interval === 'days' ? 'д' : interval === 'hours' ? 'ч' : interval === 'minutes' ? 'м' : 'с';
        return (
            <span key={interval}>
                {String(timeLeft[interval as keyof typeof timeLeft]).padStart(2, '0')}{unit}
            </span>
        );
    });

    return (
        <div className="text-sm font-mono text-primary font-semibold flex gap-1.5">
            {Object.keys(timeLeft).length ? timerComponents.filter(Boolean).slice(0, 3).reduce((prev: any, curr: any) => [prev, ':', curr]) : <span>Запущено!</span>}
        </div>
    );
};


const statusConfig: Record<string, {
    icon: React.ElementType,
    badgeClass: string,
    label: string,
    action: string,
    actionIcon: React.ElementType,
    actionVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null
}> = {
    "Активна": {
        icon: PlayCircle,
        badgeClass: "bg-green-100 text-green-800",
        label: "Запущена",
        action: "Остановить",
        actionIcon: PauseCircle,
        actionVariant: "destructive"
    },
    "Отклонено": { // Representing "Остановлена"
        icon: PauseCircle,
        badgeClass: "bg-yellow-100 text-yellow-800",
        label: "Остановлена",
        action: "Возобновить",
        actionIcon: PlayCircle,
        actionVariant: "default"
    },
    "Завершена": {
        icon: CheckCircle2,
        badgeClass: "bg-purple-100 text-purple-800",
        label: "Завершена",
        action: "В архив",
        actionIcon: History,
        actionVariant: "outline"
    },
};

interface InProgressListProps {
    initialCampaigns: Campaign[];
}

export default function InProgressList({ initialCampaigns }: InProgressListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
            <History className="h-8 w-8 text-primary" />
            <div>
                <CardTitle className="font-headline">Рассылки в работе</CardTitle>
                <CardDescription>
                    Отслеживайте и управляйте текущими, остановленными и завершенными рассылками.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {initialCampaigns.map((campaign) => {
            const config = statusConfig[campaign.status] || statusConfig["Активна"];
            return (
              <Card key={campaign.id} className="p-4">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                        <config.icon className="h-8 w-8 text-muted-foreground mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-semibold font-headline">{campaign.name}</h3>
                                    <Badge className={config.badgeClass}>{config.label}</Badge>
                                </div>
                                {campaign.status === "Активна" && campaign.scheduledAt && (
                                   <CountdownTimer targetDate={campaign.scheduledAt} />
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{campaign.text}</p>
                        </div>
                    </div>
                    <div className="flex items-stretch justify-end gap-2 mt-4 md:mt-0 w-full md:w-auto">
                        <Button variant={config.actionVariant ?? 'default'} size="sm" className="flex-grow md:flex-grow-0">
                            <config.actionIcon className="mr-2 h-4 w-4" />
                            {config.action}
                        </Button>
                    </div>
                </div>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
