
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import type { Reply } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WhatsAppIcon } from '@/components/icons';
import { Avatar } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RefreshCw, ServerCrash, MessagesSquare, Link2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import Papa from 'papaparse';


async function fetchAndParseReplies(url: string | null): Promise<{ replies: Reply[], error: string | null }> {
  if (!url || !url.startsWith('https')) {
    return { replies: [], error: "URL не указан или некорректен." };
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

export default function RepliesLivePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [url, setUrl] = useState(searchParams.get('url') || '');
  const [replies, setReplies] = useState<Reply[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchData = async () => {
      if (!url) {
        setIsLoading(false);
        setReplies([]);
        setError("Пожалуйста, введите URL для загрузки ответов.");
        return;
      }
      
      const result = await fetchAndParseReplies(url);
      setReplies(result.replies);
      setError(result.error);
      setLastUpdated(new Date().toLocaleTimeString('ru-RU'));
      setIsLoading(false);
    };

    fetchData(); // Initial fetch

    intervalId = setInterval(fetchData, 60000); // 60 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [url]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  }
  
  const handleUrlSubmit = () => {
     router.push(`/replies-live?url=${encodeURIComponent(url)}`);
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
       <main className="container mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Живые ответы из CSV</CardTitle>
                    <CardDescription>
                       Просмотр ответов из Google Sheets с автоматическим обновлением каждую минуту.
                       {lastUpdated && ` Последнее обновление: ${lastUpdated}`}
                    </Page>
                </CardDescription>
                <div className="flex w-full max-w-xl items-center space-x-2 pt-4">
                    <div className="relative flex-grow">
                        <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="url"
                            placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv"
                            value={url}
                            onChange={handleUrlChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                            className="pl-10"
                        />
                    </div>
                    <Button type="button" onClick={handleUrlSubmit}>Загрузить</Button>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                        <RefreshCw className="h-12 w-12 animate-spin text-primary mb-4" />
                        <h2 className="text-xl font-semibold">Загружаем данные...</h2>
                        <p className="text-muted-foreground">Пожалуйста, подождите.</p>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center min-h-[400px] p-4">
                        <Alert variant="destructive" className="max-w-md">
                            <ServerCrash className="h-4 w-4" />
                            <AlertTitle>Ошибка загрузки</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    </div>
                ) : (
                     <ScrollArea className="h-[calc(100vh-320px)]">
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
                            <div className="py-12 text-center text-muted-foreground min-h-[400px] flex flex-col items-center justify-center">
                                <MessagesSquare className="mx-auto h-12 w-12" />
                                <h3 className="mt-2 text-lg font-semibold">Ответов пока нет</h3>
                                <p className="mt-1 text-sm">Когда клиенты начнут отвечать, вы увидите их сообщения здесь.</p>
                            </div>
                            )}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
       </main>
    </div>
  );
}
