
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { month: "Январь", sent: 186, delivered: 180, read: 150, failed: 6 },
  { month: "Февраль", sent: 305, delivered: 295, read: 220, failed: 10 },
  { month: "Март", sent: 237, delivered: 230, read: 200, failed: 7 },
  { month: "Апрель", sent: 273, delivered: 265, read: 210, failed: 8 },
  { month: "Май", sent: 209, delivered: 205, read: 180, failed: 4 },
  { month: "Июнь", sent: 214, delivered: 210, read: 195, failed: 4 },
]

const chartConfig = {
  sent: {
    label: "Отправлено",
    color: "hsl(var(--chart-1))",
  },
  delivered: {
    label: "Доставлено",
    color: "hsl(var(--chart-2))",
  },
  read: {
    label: "Прочитано",
    color: "hsl(var(--chart-3))",
  },
  failed: {
    label: "Не удалось",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export default function AnalyticsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Обзор аналитики</CardTitle>
        <CardDescription>Обзор эффективности ваших кампаний за последние 6 месяцев.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="sent" fill="var(--color-sent)" radius={4} />
            <Bar dataKey="delivered" fill="var(--color-delivered)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
