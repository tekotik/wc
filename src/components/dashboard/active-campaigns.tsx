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
import { CheckCircle, Pencil } from "lucide-react";
import Link from 'next/link';

const campaigns = [
  {
    id: "summer_sale_24",
    name: "Летняя распродажа '24",
    status: "Активна",
    text: "Не пропустите нашу летнюю распродажу! Скидки до 50% на весь ассортимент. Только до конца недели!",
  },
  {
    id: "new_collection_24",
    name: "Новая коллекция",
    status: "Активна",
    text: "Встречайте нашу новую коллекцию! Стильные новинки уже ждут вас. Посмотрите первыми!",
  },
  {
    id: "loyalty_program",
    name: "Программа лояльности",
    status: "Активна",
    text: "Присоединяйтесь к нашей программе лояльности и получайте эксклюзивные скидки и бонусы!",
  },
  {
    id: "winter_promo",
    name: "Зимняя акция",
    status: "Завершена",
    text: "Зимняя акция завершена. Спасибо за участие!",
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
          Выберите кампанию, чтобы посмотреть ответы, или отредактируйте ее.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {activeCampaigns.map((campaign) => (
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
                  {selectedCampaignId === campaign.id && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                  )}
              </div>
            </Button>
            <Button variant="outline" size="icon" asChild>
                <Link href={`/campaigns/${campaign.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                </Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
