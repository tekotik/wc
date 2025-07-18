import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, CheckCircle2, BookOpen, XCircle } from "lucide-react";

const stats = [
  {
    icon: Send,
    title: "Сообщений отправлено",
    value: "12,345",
    change: "+12.5%",
    changeType: "increase",
  },
  {
    icon: CheckCircle2,
    title: "Коэффициент доставки",
    value: "99.2%",
    change: "+0.2%",
    changeType: "increase",
  },
  {
    icon: BookOpen,
    title: "Коэффициент прочтения",
    value: "85.7%",
    change: "-1.8%",
    changeType: "decrease",
  },
  {
    icon: XCircle,
    title: "Не удалось",
    value: "98",
    change: "+5",
    changeType: "decrease",
  },
];

export default function QuickStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{stat.value}</div>
            <p className={`text-xs ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change} по сравнению с прошлым месяцем
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
