"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

const campaigns = [
  {
    id: "summer_sale_24",
    name: "Летняя распродажа '24",
    status: "Активна",
  },
  {
    id: "new_collection_24",
    name: "Новая коллекция",
    status: "Активна",
  },
  {
    id: "loyalty_program",
    name: "Программа лояльности",
    status: "Активна",
  },
  {
    id: "winter_promo",
    name: "Зимняя акция",
    status: "Завершена",
  },
];

interface ActiveCampaignsProps {
  selectedCampaignId: string | null;
  onSelectCampaign: (id: string | null) => void;
}

export default function ActiveCampaigns({
  selectedCampaignId,
  onSelectCampaign,
}: ActiveCampaignsProps) {
  const activeCampaigns = campaigns.filter(c => c.status === "Активна");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Активные кампании</CardTitle>
        <CardDescription>
          Выберите кампанию, чтобы посмотреть ответы.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {activeCampaigns.map((campaign) => (
          <Button
            key={campaign.id}
            variant={selectedCampaignId === campaign.id ? "secondary" : "ghost"}
            className="w-full justify-start text-left h-auto py-2"
            onClick={() => onSelectCampaign(campaign.id)}
          >
            <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                    <p className="font-semibold">{campaign.name}</p>
                    <p className="text-xs text-green-500">{campaign.status}</p>
                </div>
                {selectedCampaignId === campaign.id && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                )}
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
