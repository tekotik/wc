
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { Campaign } from "@/lib/mock-data"
import { useMemo } from "react"

const chartConfig = {
  sent: {
    label: "Отправлено",
    color: "hsl(var(--chart-1))",
  },
  replies: {
    label: "Ответов",
    color: "hsl(var(--chart-2))",
  }
} satisfies ChartConfig

interface AnalyticsOverviewProps {
  campaigns: Campaign[];
}

export default function AnalyticsOverview({ campaigns }: AnalyticsOverviewProps) {
  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: { month: string; sent: number; replies: number } } = {};
    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

    campaigns.forEach(campaign => {
      if (campaign.stats?.data) {
        campaign.stats.data.forEach(stat => {
          const date = new Date(stat.date);
          const year = date.getFullYear();
          const month = date.getMonth();
          const key = `${year}-${month}`;
          
          if (!monthlyData[key]) {
            monthlyData[key] = {
              month: monthNames[month],
              sent: 0,
              replies: 0,
            };
          }
          monthlyData[key].sent += stat.sent;
          monthlyData[key].replies += stat.replies;
        });
      }
    });

    return Object.values(monthlyData).sort((a, b) => {
        const aIndex = monthNames.indexOf(a.month);
        const bIndex = monthNames.indexOf(b.month);
        return aIndex - bIndex;
    });
  }, [campaigns]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Обзор аналитики</CardTitle>
        <CardDescription>Сводная статистика по всем завершенным рассылкам.</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
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
              <Bar dataKey="sent" fill="var(--color-sent)" radius={4} name="Отправлено" />
              <Bar dataKey="replies" fill="var(--color-replies)" radius={4} name="Ответов" />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
              <p>Нет данных для отображения. Завершенные кампании со статистикой отсутствуют.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
