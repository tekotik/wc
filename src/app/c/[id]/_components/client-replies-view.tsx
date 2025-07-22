
'use client';

import React, { useEffect, useState, useTransition, useCallback } from 'react';
import { getCampaignDataAction } from '../actions';
import type { Campaign, Reply } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WhatsAppIcon, ElsenderLogo } from '@/components/icons';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RefreshCw, ServerCrash, MessagesSquare } from 'lucide-react';
import Link from 'next/link';


interface ClientRepliesViewProps {
  campaignId: string;
}

export default function ClientRepliesView({ campaignId }: ClientRepliesViewProps) {
  const [data, setData] = useState<{ campaign: Campaign | null; replies: Reply[] }>({ campaign: null, replies: [] });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback((isInitialLoad = false) => {
    const fetchAction = () => {
        getCampaignDataAction(campaignId).then(result => {
            if (result.success && result.campaign) {
                setData({ campaign: result.campaign, replies: result.replies || [] });
                setLastUpdated(new Date()); 
                if (error) setError(null);
            } else {
                if (!data.campaign) {
                    setError(result.error || 'Не удалось загрузить данные.');
                }
            }
        });
    };
    
    if (isInitialLoad) {
        startTransition(fetchAction);
    } else {
        fetchAction();
    }

  }, [campaignId, error, data.campaign]);

  useEffect(() => {
    fetchData(true);
    const intervalId = setInterval(() => fetchData(false), 60000); 
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]); // We only want this to run once when the campaignId changes.

  if (isPending && !data.campaign) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <RefreshCw className="h-12 w-12 animate-spin text-primary mb-4" />
            <h2 className="text-xl font-semibold">Загружаем данные...</h2>
            <p className="text-muted-foreground">Пожалуйста, подождите.</p>
        </div>
    );
  }

  if (error && !data.campaign) {
     return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Alert variant="destructive" className="max-w-md">
                <ServerCrash className="h-4 w-4" />
                <AlertTitle>Ошибка загрузки</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  if (!data.campaign) {
    return (
         <div className="flex items-center justify-center min-h-screen p-4">
            <Alert className="max-w-md">
                <ServerCrash className="h-4 w-4" />
                <AlertTitle>Кампания не найдена</AlertTitle>
                <AlertDescription>
                   Не удалось найти информацию по данной ссылке. Возможно, она была удалена.
                </AlertDescription>
            </Alert>
        </div>
    )
  }

  const { campaign, replies } = data;
  const messageCount = campaign.text.match(/Рассылка на (\d+) сообщений/)?.[1] || 'N/A';
  const scheduledDate = campaign.scheduledAt
    ? new Date(campaign.scheduledAt).toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'short' })
    : 'Не указано';

  return (
    <div className="min-h-screen bg-background text-foreground">
       <header className="py-4 px-4 sm:px-6 lg:px-8 border-b">
         <div className="container mx-auto flex justify-between items-center">
             <Link href="/" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                <ElsenderLogo className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold font-headline">Elsender</span>
            </Link>
         </div>
       </header>
       <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">{campaign.name}</CardTitle>
                    <CardDescription>
                        Статус рассылки: <span className="font-medium text-primary">{campaign.status}</span>.
                        Запланировано на: {scheduledDate}.
                        Всего сообщений: {messageCount}.
                        {lastUpdated && ` Последнее обновление: ${lastUpdated.toLocaleTimeString()}`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <h3 className="font-semibold mb-4 font-headline text-lg">Ответы клиентов</h3>
                     <ScrollArea className="h-[calc(100vh-350px)]">
                        <div className="space-y-6 pr-4">
                            {replies.length > 0 ? (
                            replies.map((reply, index) => (
                                <div
                                    className="flex items-start gap-4 p-3 rounded-lg transition-colors"
                                    key={index}
                                >
                                <Avatar className="flex h-10 w-10 items-center justify-center border bg-green-100">
                                    <WhatsAppIcon className="h-5 w-5 text-green-600" />
                                </Avatar>
                                <div className="grid flex-1 gap-1">
                                    <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium leading-none">
                                        {reply.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {reply.time}
                                    </p>
                                    </div>
                                    <p className="rounded-md bg-secondary p-2 text-sm text-muted-foreground">
                                    {reply.reply}
                                    </p>
                                </div>
                                </div>
                            ))
                            ) : (
                            <div className="py-12 text-center text-muted-foreground">
                                <MessagesSquare className="mx-auto h-12 w-12" />
                                <h3 className="mt-2 text-lg font-semibold">Ответов пока нет</h3>
                                <p className="mt-1 text-sm">Когда клиенты начнут отвечать, вы увидите их сообщения здесь.</p>
                            </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
       </main>
    </div>
  );
}
