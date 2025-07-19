
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from 'next/link';
import type { Campaign } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";


interface ActiveCampaignsProps {
  campaigns: Campaign[];
  selectedCampaignId: string | null;
  onSelectCampaign: (id: string) => void;
  unreadReplies: Map<string, number>;
}

export default function ActiveCampaigns({
  campaigns,
  selectedCampaignId,
  onSelectCampaign,
  unreadReplies,
}: ActiveCampaignsProps) {
 
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Активные рассылки</CardTitle>
        <CardDescription>
          Выберите рассылку, чтобы посмотреть ответы, или отредактируйте ее.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="flex items-center gap-2">
            <Button
              variant={selectedCampaignId === campaign.id ? "secondary" : "ghost"}
              className="w-full justify-start text-left h-auto py-2 flex-grow"
              onClick={() => onSelectCampaign(campaign.id)}
            >
              <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col">
                      <p className="font-semibold">{campaign.name}</p>
                      <p className="text-xs text-green-500">{campaign.status}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {unreadReplies.has(campaign.id) && (
                         <Badge
                            variant="default"
                            className="h-5 w-5 min-w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground"
                        >
                            {unreadReplies.get(campaign.id)}
                        </Badge>
                    )}
                  </div>
              </div>
            </Button>
            <Button variant="outline" size="icon" asChild>
                <Link href={`/campaigns/${campaign.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                </Link>
            </Button>
          </div>
        ))}
         {campaigns.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">Активных рассылок нет.</p>
        )}
      </CardContent>
    </Card>
  );
}
