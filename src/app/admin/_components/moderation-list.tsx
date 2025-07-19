
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, XCircle, ShieldQuestion } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Campaign, CampaignStatus } from "@/lib/mock-data";
import { updateCampaignAction } from "@/app/campaigns/actions";


interface ModerationListProps {
    initialCampaigns: Campaign[];
}

export default function ModerationList({ initialCampaigns }: ModerationListProps) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleModerate = async (id: string, newStatus: "Активна" | "Отклонено", reason?: string) => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) return;

    const updatedCampaign: Campaign = { ...campaign, status: newStatus };
    if (newStatus === "Отклонено" && reason) {
        updatedCampaign.rejectionReason = reason;
    }

    const result = await updateCampaignAction(updatedCampaign);
    
    if (result.success) {
        setCampaigns(campaigns.filter(c => c.id !== id));
        toast({
          title: "Рассылка отмодерирована",
          description: `Статус рассылки "${result.campaign?.name}" изменен на "${newStatus}".`,
        });
    } else {
        toast({
            variant: "destructive",
            title: "Ошибка",
            description: result.message || "Не удалось изменить статус."
        });
    }

    // Close dialog and reset state
    setIsRejectDialogOpen(false);
    setSelectedCampaign(null);
    setRejectionReason("");
  };

  const openRejectDialog = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsRejectDialogOpen(true);
  }

  return (
    <>
      <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
                <ShieldQuestion className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle className="font-headline">Модерация рассылок</CardTitle>
                    <CardDescription>
                        Проверьте и одобрите или отклоните рассылки, ожидающие модерации.
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="p-4">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                        <FileText className="h-6 w-6 text-muted-foreground mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-semibold font-headline">{campaign.name}</h3>
                            <p className="text-sm text-card-foreground mt-2 bg-secondary p-3 rounded-md">{campaign.text}</p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-2 mt-4 md:mt-0 w-full md:w-auto">
                        <Button size="sm" onClick={() => handleModerate(campaign.id, "Активна")} className="flex-grow md:flex-grow-0">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Одобрить и запустить
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => openRejectDialog(campaign)} className="flex-grow md:flex-grow-0">
                            <XCircle className="mr-2 h-4 w-4" />
                            Отклонить
                        </Button>
                    </div>
                </div>
              </Card>
            ))}
            {campaigns.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <ShieldQuestion className="mx-auto h-12 w-12" />
                    <h3 className="mt-2 text-lg font-semibold">Ожидающих рассылок нет</h3>
                    <p className="mt-1 text-sm">Все рассылки отмодерированы.</p>
                </div>
              )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Отклонить рассылку</DialogTitle>
                <DialogDescription>
                   Пожалуйста, укажите причину отклонения для рассылки "{selectedCampaign?.name}".
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Label htmlFor="rejectionReason">Причина отклонения</Label>
                <Textarea 
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Например, 'Текст содержит недопустимые выражения'..."
                    className="mt-2"
                />
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="outline">Отмена</Button></DialogClose>
                <Button variant="destructive" onClick={() => handleModerate(selectedCampaign!.id, "Отклонено", rejectionReason)} disabled={!rejectionReason}>
                    Отклонить рассылку
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
