
"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { Campaign } from "@/lib/mock-data";

const chartConfig = {
  sent: {
    label: "Отправлено",
    color: "hsl(var(--chart-1))",
  },
  replies: {
    label: "Ответов",
    color: "hsl(var(--chart-2))",
  },
}

interface StatsViewProps {
    campaign: Campaign;
}

export default function StatsView({ campaign }: StatsViewProps) {
  const statsData = campaign.stats?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Статистика кампании</CardTitle>
        <CardDescription>Обзор эффективности рассылки "{campaign.name}".</CardDescription>
      </CardHeader>
      <CardContent>
        {statsData.length > 0 ? (
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={statsData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="sent" stroke="var(--color-sent)" strokeWidth={2} activeDot={{ r: 8 }} name="Отправлено" />
              <Line type="monotone" dataKey="replies" stroke="var(--color-replies)" strokeWidth={2} name="Ответов" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        ) : (
            <div className="text-center py-12 text-muted-foreground">
                <p>Данные по статистике для этой кампании отсутствуют.</p>
            </div>
        )}
      </CardContent>
    </Card>
  )
}
