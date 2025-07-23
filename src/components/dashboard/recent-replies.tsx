
"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircleReply, ChevronRight } from "lucide-react"
import type { Reply } from "@/lib/mock-data";
import { WhatsAppIcon } from "@/components/icons";
import Link from "next/link";

interface RecentRepliesProps {
  replies: Reply[];
  selectedCampaignId: string | null;
}

export default function RecentReplies({ replies, selectedCampaignId }: RecentRepliesProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle className="font-headline">Последние ответы</CardTitle>
            <CardDescription>Ответы клиентов на ваши рассылки.</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
            <Link href="/replies">
              Все ответы <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
       {replies.length > 0 ? (
         replies.map((reply, index) => (
          <div className="flex items-start gap-4" key={index}>
            <Avatar className="h-10 w-10 border bg-green-100 flex items-center justify-center">
                <WhatsAppIcon className="h-5 w-5 text-green-600" />
            </Avatar>
            <div className="grid gap-1 flex-1">
              <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">{reply.name}</p>
                  <p className="text-xs text-muted-foreground">{reply.time}</p>
              </div>
              <p className="text-sm text-muted-foreground p-2 bg-secondary rounded-md">{reply.reply}</p>
               <div className="text-xs text-muted-foreground pt-1">
                Из рассылки: «{reply.campaignId}»
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MessageCircleReply className="h-4 w-4" />
            </Button>
          </div>
         ))
       ) : (
        <div className="text-center text-muted-foreground py-8">
            <p>{selectedCampaignId ? "Ответов для этой рассылки пока нет." : "Новых ответов пока нет."}</p>
        </div>
       )}
      </CardContent>
    </Card>
  )
}
