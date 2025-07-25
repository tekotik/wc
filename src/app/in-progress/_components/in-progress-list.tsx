
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Trash2, Link as LinkIcon, Calendar, List, Clock, History, Clipboard, ClipboardCheck, Eye, BarChart3, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Campaign, CampaignStatus } from "@/lib/mock-data";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { updateCampaignAction, deleteCampaignAction } from "@/app/campaigns/actions";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { cn } from "@/lib/utils";

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
        return <span>Запущена!</span>;
    }

    return (
        <span>
            {timeLeft.days > 0 ? `${timeLeft.days}д ` : ''}
            {formatSegment(timeLeft.hours)}:{formatSegment(timeLeft.minutes)}:{formatSegment(timeLeft.seconds)}
        </span>
    );
};


const getMessageCount = (campaign: Campaign) => {
    const match = campaign.text?.match(/Рассылка на (\d+) сообщений/);
    return match ? match[1] : 'N/A';
};

const statusStyles: Record<CampaignStatus, string> = {
    "Черновик": "bg-gray-100 text-gray-800",
    "На модерации": "bg-yellow-100 text-yellow-800",
    "Одобрено": "bg-blue-100 text-blue-800",
    "Отклонено": "bg-red-100 text-red-800",
    "Активна": "bg-green-100 text-green-800",
    "Завершена": "bg-purple-100 text-purple-800",
};

interface InProgressListProps {
    initialCampaigns: Campaign[];
}

export default function InProgressList({ initialCampaigns }: InProgressListProps) {
    const [campaigns, setCampaigns] = useState(initialCampaigns);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        setCampaigns(initialCampaigns);
    }, [initialCampaigns]);

    const handleStatusChange = async (campaign: Campaign, newStatus: CampaignStatus) => {
        const result = await updateCampaignAction({ ...campaign, status: newStatus });
        if (result.success && result.campaign) {
            setCampaigns(prev => prev.map(c => c.id === campaign.id ? result.campaign! : c));
            toast({
                title: "Статус обновлен!",
                description: `Рассылка "${result.campaign.name}" теперь имеет статус "${newStatus}".`
            });
            router.refresh();
        } else {
            toast({ variant: "destructive", title: "Ошибка", description: result.message });
        }
    };

    const handleDelete = async (campaignId: string) => {
        const result = await deleteCampaignAction(campaignId);
        if (result.success) {
            setCampaigns(prev => prev.filter(c => c.id !== campaignId));
            toast({ title: "Успех!", description: "Рассылка успешно удалена." });
        } else {
            toast({ variant: "destructive", title: "Ошибка", description: result.message });
        }
    };

  return (
    <>
      <div className="flex items-center gap-3">
          <History className="h-8 w-8 text-primary" />
          <div>
              <h1 className="text-2xl font-bold font-headline">Все рассылки</h1>
              <p className="text-muted-foreground">
                  Здесь находятся все кампании в системе, независимо от их статуса.
              </p>
          </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {campaigns.map((campaign) => {
          const messageCount = getMessageCount(campaign);
          const scheduledDate = campaign.scheduledAt ? new Date(campaign.scheduledAt).toLocaleString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Не указана';
          
          return (
            <Card key={campaign.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="font-headline text-lg">{campaign.name}</CardTitle>
                    <Badge variant="outline" className={cn("font-semibold", statusStyles[campaign.status])}>{campaign.status}</Badge>
                </div>
                <CardDescription>
                  {campaign.userName || campaign.userEmail || 'Системная рассылка'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-2 text-sm">
                <p className="text-muted-foreground line-clamp-2">{campaign.text || 'Нет текста'}</p>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{scheduledDate}</span>
                </div>
                 {campaign.status === "Активна" && campaign.scheduledAt && <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><CountdownTimer targetDate={campaign.scheduledAt} /></div>}
              </CardContent>
              <CardFooter className="flex-col items-start p-0">
                  <Separator className="mb-2" />
                  <div className="flex items-center justify-between w-full px-4 pb-2">
                      <Button variant="link" className="p-0 h-auto" asChild>
                          <Link href={`/admin/edit/${campaign.id}`}>
                             <Pencil className="mr-2 h-4 w-4" />
                             Просмотр/Редактировать
                          </Link>
                      </Button>
                      <div className="flex items-center">
                        <AlertDialog>
                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                    <AlertDialogDescription>Это действие необратимо. Рассылка "{campaign.name}" будет удалена.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(campaign.id)} className="bg-destructive hover:bg-destructive/90">Удалить</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </div>
                  </div>
              </CardFooter>
            </Card>
          )
        })}
        {campaigns.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
                <History className="mx-auto h-12 w-12" />
                <h3 className="mt-2 text-lg font-semibold">Рассылок нет</h3>
                <p className="mt-1 text-sm">В системе еще не создано ни одной рассылки.</p>
            </div>
          )}
      </div>
    </>
  );
}
