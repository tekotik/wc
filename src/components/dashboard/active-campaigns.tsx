
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
import { Trash2 } from "lucide-react";
import Link from 'next/link';
import type { Campaign } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deleteCampaignAction } from "@/app/campaigns/actions";


interface ActiveCampaignsProps {
  campaigns: Campaign[];
  selectedCampaignId: string | null;
  onSelectCampaign: (id: string) => void;
  totalReplies: Map<string, number>;
}

export default function ActiveCampaigns({
  campaigns,
  selectedCampaignId,
  onSelectCampaign,
  totalReplies,
}: ActiveCampaignsProps) {
    const { toast } = useToast();

    const handleDelete = async (e: React.MouseEvent, campaignId: string) => {
        e.stopPropagation(); // Prevent the campaign selection
        const result = await deleteCampaignAction(campaignId);
        if (result.success) {
            toast({ title: "Успех!", description: "Рассылка успешно удалена." });
        } else {
            toast({ variant: "destructive", title: "Ошибка", description: result.message });
        }
    }
 
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Активные рассылки</CardTitle>
        <CardDescription>
          Выберите рассылку, чтобы посмотреть ответы.
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
                    {totalReplies.has(campaign.id) && totalReplies.get(campaign.id)! > 0 && (
                         <Badge
                            variant="default"
                            className="h-5 w-5 min-w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground"
                        >
                            {totalReplies.get(campaign.id)}
                        </Badge>
                    )}
                  </div>
              </div>
            </Button>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" onClick={(e) => e.stopPropagation()}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                        <AlertDialogDescription>Это действие необратимо. Рассылка "{campaign.name}" будет удалена.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={(e) => handleDelete(e, campaign.id)} className="bg-destructive hover:bg-destructive/90">Удалить</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
         {campaigns.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">Активных рассылок нет.</p>
        )}
      </CardContent>
    </Card>
  );
}
