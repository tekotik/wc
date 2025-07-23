
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import type { Campaign, Reply } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WhatsAppIcon, ElsenderLogo } from '@/components/icons';
import { Avatar } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RefreshCw, ServerCrash, MessagesSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Papa from 'papaparse';

// Определяем тип для ответа от нашего нового API
interface CampaignDataResponse {
  campaign: Campaign;
}

interface ClientRepliesViewProps {
  campaignId: string;
}


async function fetchAndParseReplies(url: string | null): Promise<{ replies: Reply[], error: string | null }> {
  if (!url || !url.startsWith('https')) {
    return { replies: [], error: "URL ответов не настроен администратором." };
  }

  try {
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Не удалось загрузить таблицу: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    const parsed = Papa.parse(csvText, { skipEmptyLines: true });
    
    if (parsed.errors.length) {
        console.error("Ошибки парсинга:", parsed.errors);
    }

    const allRows = parsed.data as string[][];

    const replies: Reply[] = allRows
      .slice(1) // Пропустить заголовок
      .map((row, index) => ({
        campaignId: row[0] || 'default_campaign',
        name: row[1] || `Пользователь ${index + 1}`,
        reply: row[2] || '',
        time: row[3] || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: {
          src: "https://placehold.co/40x40.png",
          fallback: (row[1] || 'П').charAt(0).toUpperCase(),
          hint: "person user",
        },
        unread: row[4]?.toLowerCase() === 'true' || row[4]?.toLowerCase() === 'unread',
      }))
      .filter(reply => reply.reply); 

    return { replies: replies.reverse(), error: null };

  } catch (error) {
    console.error(`Ошибка при загрузке или парсинге CSV из ${url}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Произошла неизвестная ошибка.';
    return { replies: [], error: errorMessage };
  }
}


export default function ClientRepliesView({ campaignId }: ClientRepliesViewProps) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    // Fetch campaign details first
    if (!campaign) {
        try {
             const campaignResponse = await fetch(`/api/campaign/${campaignId}`);
             if (!campaignResponse.ok) {
                const errorData = await campaignResponse.json();
                throw new Error(errorData.error || 'Ошибка при загрузке данных кампании');
            }
            const campaignResult: CampaignDataResponse = await campaignResponse.json();
            setCampaign(campaignResult.campaign);
            return; // Exit and let the effect run again with the campaign data
        } catch(e) {
            const errorMessage = e instanceof Error ? e.message : 'Не удалось загрузить данные кампании.';
            console.error(errorMessage);
            setError(errorMessage);
            setIsLoading(false);
            return;
        }
    }
    
    // Once campaign is loaded, fetch replies
    const result = await fetchAndParseReplies(campaign.repliesCsvUrl || null);
    setReplies(result.replies);
    if(result.error && replies.length === 0){
        setError(result.error);
    } else if (!result.error) {
        setError(null); // Clear previous errors if fetch is successful
    }
    setLastUpdated(new Date());
    
  }, [campaignId, campaign, replies.length]);

  useEffect(() => {
    setIsLoading(true);
    fetchData().finally(() => setIsLoading(false)); // Initial fetch

    const intervalId = setInterval(() => {
      fetchData();
    }, 60000); // 60 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [fetchData]);


  if (isLoading && !campaign) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h2 className="text-xl font-semibold">Загружаем данные кампании...</h2>
            <p className="text-muted-foreground">Пожалуйста, подождите.</p>
        </div>
    );
  }

  if (error && !campaign) {
     return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Alert variant="destructive" className="max-w-md">
                <ServerCrash className="h-4 w-4" />
                <AlertTitle>Ошибка загрузки</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    );
  }

  if (!campaign) {
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
                        {lastUpdated && ` Последнее обновление: ${lastUpdated.toLocaleTimeString('ru-RU')}`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <h3 className="font-semibold mb-4 font-headline text-lg">Ответы клиентов</h3>
                     <ScrollArea className="h-[calc(100vh-350px)]">
                        <div className="space-y-6 pr-4">
                            {isLoading && replies.length === 0 ? (
                                 <div className="flex flex-col items-center justify-center text-center py-12">
                                    <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
                                    <p className="text-muted-foreground">Обновляем ответы...</p>
                                </div>
                            ) : error ? (
                                <div className="py-12 text-center text-destructive-foreground bg-destructive/10 rounded-md">
                                    <ServerCrash className="mx-auto h-12 w-12" />
                                    <h3 className="mt-2 text-lg font-semibold">Ошибка при загрузке ответов</h3>
                                    <p className="mt-1 text-sm">{error}</p>
                                </div>
                            ) : replies.length > 0 ? (
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
