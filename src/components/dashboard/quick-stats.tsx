import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";

const stats = [
  {
    icon: Send,
    title: "Сообщений отправлено",
    value: "12,345",
    change: "+12.5%",
    changeType: "increase",
  },
];

export default function QuickStats() {
  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{stat.value}</div>
            <p className={`text-xs text-green-600`}>
              {stat.change} по сравнению с прошлым месяцем
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
