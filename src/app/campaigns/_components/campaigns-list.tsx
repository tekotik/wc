
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Pencil, Rocket, XCircle, Eye, BarChart3, Send } from "lucide-react";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Campaign, CampaignStatus } from "@/lib/mock-data";
import { updateCampaignAction } from "@/app/campaigns/actions";
import { useRouter } from "next/navigation";


const statusStyles: Record<CampaignStatus, string> = {
    "Черновик": "bg-gray-100 text-gray-800",
    "На модерации": "bg-yellow-100 text-yellow-800",
    "Одобрено": "bg-blue-100 text-blue-800",
    "Отклонено": "bg-red-100 text-red-800",
    "Активна": "bg-green-100 text-green-800",
    "Завершена": "bg-purple-100 text-purple-800",
};

interface CampaignsListProps {
    initialCampaigns: Campaign[];
}

export default function CampaignsList({ initialCampaigns }: CampaignsListProps) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const { toast } = useToast();
  const router = useRouter();


  const handleStatusChange = async (id: string, status: CampaignStatus) => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) return;

    const updatedCampaign = { ...campaign, status };
    const result = await updateCampaignAction(updatedCampaign);
    
    if(result.success && result.campaign){
        setCampaigns(campaigns.map(c => c.id === id ? result.campaign! : c));
        toast({
          title: "Статус обновлен!",
          description: `Рассылка "${result.campaign.name}" теперь ${result.campaign.status}.`,
        });
        router.refresh(); // Refresh server components
    } else {
        toast({
            variant: "destructive",
            title: "Ошибка",
            description: result.message || "Не удалось обновить статус."
        })
    }
  };

  const getActions = (campaign: Campaign) => {
    switch (campaign.status) {
      case "Одобрено":
        return (
          <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="sm">
                    <Rocket className="mr-2 h-4 w-4" />
                    Запустить
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Вы уверены, что хотите запустить рассылку?</AlertDialogTitle>
                <AlertDialogDescription>
                    Это действие запустит рассылку "{campaign.name}". Отменить это действие будет невозможно.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleStatusChange(campaign.id, "Активна")}>Запустить</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      case "Отклонено":
      case "Черновик":
        return (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/campaigns/${campaign.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              {campaign.status === "Черновик" ? "Заполнить" : "Редактировать"}
            </Link>
          </Button>
        );
       case "Активна":
        return (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/campaigns/${campaign.id}/edit`}>
              <Eye className="mr-2 h-4 w-4" />
              Просмотр
            </Link>
          </Button>
        );
      case "Завершена":
         return (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/campaigns/${campaign.id}/stats`}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Статистика
            </Link>
          </Button>
        );
       case "На модерации":
         return (
            <Button variant="outline" size="sm" disabled>
                <Send className="mr-2 h-4 w-4" />
                На модерации
            </Button>
        );
      default:
        return null;
    }
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Все рассылки</CardTitle>
          <CardDescription>
            Просмотр всех рассылок, созданных в системе.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="transform transition-transform duration-300 ease-out hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-primary" />
                      <div>
                          <CardTitle className="text-lg font-headline">{campaign.name}</CardTitle>
                          <Badge className={cn("font-semibold", statusStyles[campaign.status])}>{campaign.status}</Badge>
                      </div>
                  </div>
                  <div className="flex items-center gap-2">
                      {getActions(campaign)}
                  </div>
                </div>
              </CardHeader>
              {campaign.text && <CardContent>
                <p className="text-sm text-card-foreground line-clamp-2">{campaign.text}</p>
                  {campaign.status === 'Отклонено' && campaign.rejectionReason && (
                  <div className="mt-2 flex items-start gap-2 rounded-md border border-destructive/50 bg-red-50 p-3 text-sm text-red-900">
                    <XCircle className="h-5 w-5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Причина отклонения:</span> {campaign.rejectionReason}
                    </div>
                  </div>
                )}
              </CardContent>}
            </Card>
          ))}
           {campaigns.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12" />
                  <h3 className="mt-2 text-lg font-semibold">Рассылок пока нет</h3>
                  <p className="mt-1 text-sm">Начните с создания новой рассылки на панели управления.</p>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
