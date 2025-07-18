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
  { month: "January", sent: 186, delivered: 180, read: 150, failed: 6 },
  { month: "February", sent: 305, delivered: 295, read: 220, failed: 10 },
  { month: "March", sent: 237, delivered: 230, read: 200, failed: 7 },
  { month: "April", sent: 273, delivered: 265, read: 210, failed: 8 },
  { month: "May", sent: 209, delivered: 205, read: 180, failed: 4 },
  { month: "June", sent: 214, delivered: 210, read: 195, failed: 4 },
]

const chartConfig = {
  sent: {
    label: "Sent",
    color: "hsl(var(--chart-1))",
  },
  delivered: {
    label: "Delivered",
    color: "hsl(var(--chart-2))",
  },
  read: {
    label: "Read",
    color: "hsl(var(--chart-3))",
  },
  failed: {
    label: "Failed",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export default function AnalyticsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Analytics Overview</CardTitle>
        <CardDescription>An overview of your campaign performance in the last 6 months.</CardDescription>
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
