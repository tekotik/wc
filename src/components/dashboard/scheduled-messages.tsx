import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const scheduledMessages = [
  {
    name: "Оливия Мартин",
    handle: "olivia.martin@email.com",
    time: "через 1 час",
    avatar: {
      src: "https://placehold.co/40x40.png",
      fallback: "OM",
      hint: "woman portrait"
    },
  },
  {
    name: "Джексон Ли",
    handle: "jackson.lee@email.com",
    time: "через 3 часа",
    avatar: {
      src: "https://placehold.co/40x40.png",
      fallback: "JL",
      hint: "man portrait"
    },
  },
  {
    name: "Изабелла Нгуен",
    handle: "isabella.nguyen@email.com",
    time: "завтра в 9:00",
     avatar: {
      src: "https://placehold.co/40x40.png",
      fallback: "IN",
      hint: "woman smiling"
    },
  },
    {
    name: "Уильям Ким",
    handle: "will@email.com",
    time: "завтра в 13:00",
     avatar: {
      src: "https://placehold.co/40x40.png",
      fallback: "WK",
      hint: "man glasses"
    },
  },
    {
    name: "София Дэвис",
    handle: "sofia.davis@email.com",
    time: "через 2 дня",
     avatar: {
      src: "https://placehold.co/40x40.png",
      fallback: "SD",
      hint: "woman professional"
    },
  },
];

export default function ScheduledMessages() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Запланированные сообщения</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
       {scheduledMessages.map((message) => (
        <div className="flex items-center gap-4" key={message.handle}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={message.avatar.src} alt="Avatar" data-ai-hint={message.avatar.hint} />
            <AvatarFallback>{message.avatar.fallback}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">{message.name}</p>
            <p className="text-sm text-muted-foreground">{message.handle}</p>
          </div>
          <div className="ml-auto font-medium text-sm">{message.time}</div>
        </div>
       ))}
      </CardContent>
    </Card>
  )
}
