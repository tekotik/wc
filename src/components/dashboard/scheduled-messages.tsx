import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const scheduledMessages = [
  {
    name: "Olivia Martin",
    handle: "olivia.martin@email.com",
    time: "in 1 hour",
    avatar: {
      src: "https://placehold.co/40x40.png",
      fallback: "OM",
      hint: "woman portrait"
    },
  },
  {
    name: "Jackson Lee",
    handle: "jackson.lee@email.com",
    time: "in 3 hours",
    avatar: {
      src: "https://placehold.co/40x40.png",
      fallback: "JL",
      hint: "man portrait"
    },
  },
  {
    name: "Isabella Nguyen",
    handle: "isabella.nguyen@email.com",
    time: "tomorrow at 9:00 AM",
     avatar: {
      src: "https://placehold.co/40x40.png",
      fallback: "IN",
      hint: "woman smiling"
    },
  },
    {
    name: "William Kim",
    handle: "will@email.com",
    time: "tomorrow at 1:00 PM",
     avatar: {
      src: "https://placehold.co/40x40.png",
      fallback: "WK",
      hint: "man glasses"
    },
  },
    {
    name: "Sofia Davis",
    handle: "sofia.davis@email.com",
    time: "in 2 days",
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
        <CardTitle className="font-headline">Scheduled Messages</CardTitle>
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
