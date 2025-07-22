
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Trash2, Link as LinkIcon, Calendar, List, Clock, History, Clipboard, ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Campaign, CampaignStatus } from "@/lib/mock-data";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { updateCampaignAction, deleteCampaignAction } from "@/app/campaigns/actions";
import { Input } from "@/components/ui/input";

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


const getMessageCount = (text: string) => {
    const match = text.match(/Рассылка на (\d+) сообщений/);
    return match ? match[1] : 'N/A';
};

interface InProgressListProps {
    initialCampaigns: Campaign[];
}

export default function InProgressList({ initialCampaigns }: InProgressListProps) {
    const [campaigns, setCampaigns] = useState(initialCampaigns);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setCampaigns(initialCampaigns);
    }, [initialCampaigns]);

    const handleStatusChange = async (campaign: Campaign, newStatus: "Активна" | "Отклонено") => { // "Отклонено" is "Остановлена"
        const result = await updateCampaignAction({ ...campaign, status: newStatus });
        if (result.success && result.campaign) {
            setCampaigns(prev => prev.map(c => c.id === campaign.id ? result.campaign! : c));
            toast({
                title: "Статус обновлен!",
                description: `Рассылка "${result.campaign.name}" теперь имеет статус "${newStatus === 'Активна' ? 'Активна' : 'Остановлена'}".`
            });
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

    const handleCopyLink = (link: string) => {
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    
    const clientLink = selectedCampaign ? `${window.location.origin}/c/${selectedCampaign.id}` : "";

    const statusConfig: Record<string, {
        badgeClass: string,
        label: string,
        actions: (campaign: Campaign) => React.ReactNode,
        details: (campaign: Campaign) => React.ReactNode,
    }> = {
        "Активна": {
            badgeClass: "bg-green-100 text-green-800 border-green-200",
            label: "Запущена",
            actions: (campaign) => (
                <>
                    <Button variant="ghost" size="icon" onClick={() => handleStatusChange(campaign, "Отклонено")}><Pause className="h-4 w-4" /></Button>
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
            actions: (campaign) => (
                 <>
                    <Button variant="ghost" size="icon" onClick={() => handleStatusChange(campaign, "Активна")}><Play className="h-4 w-4" /></Button>
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
                </>
            ),
            details: () => null,
        },
        "Завершена": {
            badgeClass: "bg-gray-100 text-gray-800 border-gray-200",
            label: "Завершена",
            actions: (campaign) => <AlertDialog>
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
                    </AlertDialog>,
             details: () => (
                <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <span>Кампания завершена</span>
                </div>
            )
        },
    };

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
        {campaigns.map((campaign) => {
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
                      <Button variant="link" className="p-0 h-auto" onClick={() => { setSelectedCampaign(campaign); setIsLinkDialogOpen(true); }}>
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Получить ссылку
                      </Button>
                      <div className="flex items-center">
                        {config.actions(campaign)}
                      </div>
                  </div>
              </CardFooter>
            </Card>
          )
        })}
        {campaigns.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
                <History className="mx-auto h-12 w-12" />
                <h3 className="mt-2 text-lg font-semibold">Рассылок в работе нет</h3>
                <p className="mt-1 text-sm">Начните с создания новой рассылки на панели управления.</p>
            </div>
          )}
      </div>
       <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Ссылка для клиента</DialogTitle>
                <DialogDescription>
                   Поделитесь этой ссылкой с вашим клиентом для отслеживания рассылки "{selectedCampaign?.name}".
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
               <div className="flex w-full items-center space-x-2">
                    <Input
                        id="clientLink"
                        value={clientLink}
                        readOnly
                    />
                    <Button type="button" size="icon" onClick={() => handleCopyLink(clientLink)}>
                        {copied ? <ClipboardCheck className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button>Закрыть</Button></DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
