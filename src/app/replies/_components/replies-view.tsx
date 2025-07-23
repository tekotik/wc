
'use client';

import React, { useEffect, useState } from 'react';
import type { Reply } from '@/lib/mock-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageCircleReply, MessagesSquare } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface RepliesViewProps {
  initialReplies: Reply[];
  lastFetched: Date;
}

export default function RepliesView({ initialReplies, lastFetched }: RepliesViewProps) {
  const [replies, setReplies] = useState(initialReplies);
  const [displayTime, setDisplayTime] = useState<string | null>(null);

  useEffect(() => {
    setReplies(initialReplies);
    // Set time string only on the client to avoid hydration mismatch
    setDisplayTime(new Date(lastFetched).toLocaleTimeString());
  }, [initialReplies, lastFetched]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <MessagesSquare className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="font-headline">Все ответы</CardTitle>
            <CardDescription>
              Все ответы от клиентов в реальном времени. Новые ответы подсвечены.
              <br/>
              <span className="text-xs text-muted-foreground">Последнее обновление: {displayTime || '...'}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-6 pr-4">
            {replies.length > 0 ? (
              replies.map((reply, index) => (
                <div 
                    className={cn(
                        "flex items-start gap-4 p-3 rounded-lg transition-colors",
                        reply.unread && "bg-primary/10"
                    )} 
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
                    <div className="text-xs text-muted-foreground pt-1">
                      Из рассылки: "{reply.campaignId}"
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                  >
                    <MessageCircleReply className="h-4 w-4" />
                  </Button>
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
  );
}
