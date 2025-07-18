
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import type { Campaign } from "@/lib/mock-data";
import { updateCampaignAction } from "@/app/campaigns/actions";
import { useRouter } from "next/navigation";


export default function EditCampaignForm({ campaign: initialCampaign }: { campaign: Campaign }) {
  const { toast } = useToast();
  const [campaign, setCampaign] = useState(initialCampaign);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let newStatus = campaign.status;
    let toastMessage = `Рассылка "${campaign.name}" сохранена.`;

    if (campaign.status === "Черновик" || campaign.status === "Отклонено") {
        newStatus = "На модерации";
        toastMessage = `Рассылка "${campaign.name}" отправлена на модерацию.`;
    }
    
    const updatedCampaign = { ...campaign, status: newStatus };
    const result = await updateCampaignAction(updatedCampaign);

    if (result.success) {
        setCampaign(result.campaign!);
        toast({
            title: "Успех!",
            description: toastMessage
        });
        // Redirect to the campaigns list after sending to moderation
        if (newStatus === "На модерации") {
          router.push('/campaigns');
        }
    } else {
         toast({
            variant: "destructive",
            title: "Ошибка",
            description: result.message || "Не удалось сохранить рассылку."
        });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCampaign({ ...campaign, [id]: value });
  };

  const isViewOnly = campaign.status === 'Активна' || campaign.status === 'Завершена' || campaign.status === 'На модерации';

  const getButtonContent = () => {
    if (isViewOnly) return null;
    if (campaign.status === 'Отклонено') return { icon: <Send className="mr-2 h-4 w-4" />, text: "Отправить на перемодерацию" };
    if (campaign.status === 'Черновик') return { icon: <Send className="mr-2 h-4 w-4" />, text: "Отправить на модерацию" };
    return { icon: <Save className="mr-2 h-4 w-4" />, text: "Сохранить изменения" };
  }
  
  const buttonContent = getButtonContent();

  const getCardDescription = () => {
    switch (campaign.status) {
        case 'Черновик': return 'Заполните детали рассылки и отправьте ее на модерацию.';
        case 'Отклонено': return 'Внесите правки и отправьте рассылку на повторную модерацию.';
        case 'Активна': return 'Эта рассылка сейчас активна. Редактирование невозможно.';
        case 'Завершена': return 'Эта рассылка завершена. Редактирование невозможно.';
        case 'На модерации': return 'Эта рассылка на модерации. Редактирование временно невозможно.';
        default: return 'Просмотр или редактирование деталей вашей рассылки.';
    }
  }


  return (
    <>
        <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/campaigns">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Назад</span>
            </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            {isViewOnly ? `Просмотр рассылки` : `Редактировать рассылку`}
        </h1>
        </div>
        <Card>
        <form onSubmit={handleSubmit}>
            <CardHeader>
                <CardTitle className="font-headline">{campaign.name}</CardTitle>
                <CardDescription>{getCardDescription()}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid w-full gap-2">
                    <Label htmlFor="name">Название рассылки</Label>
                    <Input 
                        id="name" 
                        placeholder="Например, 'Весенняя распродажа'" 
                        value={campaign.name}
                        onChange={handleInputChange}
                        required
                        disabled={isViewOnly}
                    />
                    </div>
                    <div className="grid w-full gap-2">
                    <Label htmlFor="text">Текст рассылки</Label>
                    <Textarea 
                        id="text" 
                        placeholder="Введите текст вашей рассылки здесь..." 
                        rows={10} 
                        value={campaign.text}
                        onChange={handleInputChange}
                        required
                        disabled={isViewOnly}
                    />
                    </div>
                </div>
            </CardContent>
            {buttonContent && (
                <CardFooter>
                    <Button type="submit">
                        {buttonContent.icon}
                        {buttonContent.text}
                    </Button>
                </CardFooter>
            )}
        </form>
        </Card>
    </>
  );
}
