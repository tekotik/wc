
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageSquareReply } from "lucide-react";
import type { Campaign } from "@/lib/mock-data";
import { useMemo } from "react";
import AnalyticsOverview from "./analytics-overview";

interface QuickStatsProps {
    campaigns: Campaign[];
}

export default function QuickStats({ campaigns }: QuickStatsProps) {
    const completedCampaigns = useMemo(() => campaigns.filter(c => c.status === 'Завершена' && c.stats), [campaigns]);

    const totalStats = useMemo(() => {
        return completedCampaigns.reduce((acc, campaign) => {
            if (campaign.stats?.data) {
                campaign.stats.data.forEach(stat => {
                    acc.sent += stat.sent;
                    acc.replies += stat.replies;
                });
            }
            return acc;
        }, { sent: 0, replies: 0 });
    }, [completedCampaigns]);

    const conversionRate = totalStats.sent > 0 ? ((totalStats.replies / totalStats.sent) * 100).toFixed(2) : "0.00";

    const stats = [
        {
            icon: Send,
            title: "Всего отправлено",
            value: totalStats.sent.toLocaleString(),
            description: "За все время",
        },
        {
            icon: MessageSquareReply,
            title: "Всего ответов",
            value: totalStats.replies.toLocaleString(),
            description: `Конверсия ${conversionRate}%`,
        },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-headline">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
             <AnalyticsOverview campaigns={completedCampaigns} />
        </div>
    );
}
