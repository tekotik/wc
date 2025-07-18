
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircleReply, ChevronRight } from "lucide-react"
import { useState } from "react";

const allReplies = [
  // Campaign: summer_sale_24
  {
    campaignId: "summer_sale_24",
    name: "Елена Воронова",
    reply: "Спасибо, очень актуально! А есть ли размеры побольше?",
    time: "2 мин назад",
    avatar: { src: "https://placehold.co/40x40.png", fallback: "ЕВ", hint: "woman thinking" },
  },
  {
    campaignId: "summer_sale_24",
    name: "Максим Петров",
    reply: "Отличное предложение! Уже оформил заказ на сайте.",
    time: "15 мин назад",
    avatar: { src: "https://placehold.co/40x40.png", fallback: "МП", hint: "man smiling" },
  },
  // Campaign: new_collection_24
  {
    campaignId: "new_collection_24",
    name: "Анна Сидорова",
    reply: "Подскажите, пожалуйста, до какого числа действует скидка на новую коллекцию?",
    time: "48 мин назад",
    avatar: { src: "https://placehold.co/40x40.png", fallback: "АС", hint: "woman casual" },
  },
  {
    campaignId: "new_collection_24",
    name: "Иван Козлов",
    reply: "Коллекция супер! Есть ли доставка в Санкт-Петербург?",
    time: "1 час назад",
    avatar: { src: "https://placehold.co/40x40.png", fallback: "ИК", hint: "man thoughtful" },
  },
  // Campaign: loyalty_program
  {
    campaignId: "loyalty_program",
    name: "Ольга Белова",
    reply: "Спасибо за информацию о программе лояльности. Как я могу присоединиться?",
    time: "3 часа назад",
    avatar: { src: "https://placehold.co/40x40.png", fallback: "ОБ", hint: "woman happy" },
  },
];


export default function RecentReplies() {
  // Since we can't easily pass state between server components and client components
  // without a full re-render, we will make this component less dynamic for now.
  // It will show all recent replies instead of filtering by a selected campaign.
  const [repliesToShow] = useState(allReplies.slice(0, 5));

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle className="font-headline">Последние ответы</CardTitle>
            <CardDescription>Ответы клиентов на ваши кампании.</CardDescription>
        </div>
        <Button variant="outline" size="sm">
            Все ответы <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
       {repliesToShow.length > 0 ? (
         repliesToShow.map((reply, index) => (
          <div className="flex items-start gap-4" key={index}>
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={reply.avatar.src} alt="Avatar" data-ai-hint={reply.avatar.hint} />
              <AvatarFallback>{reply.avatar.fallback}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1 flex-1">
              <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">{reply.name}</p>
                  <p className="text-xs text-muted-foreground">{reply.time}</p>
              </div>
              <p className="text-sm text-muted-foreground p-2 bg-secondary rounded-md">{reply.reply}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MessageCircleReply className="h-4 w-4" />
            </Button>
          </div>
         ))
       ) : (
        <div className="text-center text-muted-foreground py-8">
            <p>Ответов пока нет.</p>
        </div>
       )}
      </CardContent>
    </Card>
  )
}
