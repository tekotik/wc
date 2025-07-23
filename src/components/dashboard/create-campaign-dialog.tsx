
"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { createCampaignAction } from "@/app/campaigns/actions";
import type { Campaign } from "@/lib/mock-data";


export default function CreateCampaignDialog({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [campaignName, setCampaignName] = useState("");
  const [campaignText, setCampaignText] = useState("");
  const [campaignBaseFile, setCampaignBaseFile] = useState<{ name: string; content: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCampaignBaseFile({ name: file.name, content });
        toast({
          title: "Файл прикреплен",
          description: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const resetForm = () => {
    setCampaignName("");
    setCampaignText("");
    setCampaignBaseFile(null);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!campaignName || !campaignText || !campaignBaseFile) {
        toast({
            variant: "destructive",
            title: "Ошибка",
            description: "Пожалуйста, заполните все поля и прикрепите базу."
        });
        setIsSubmitting(false);
        return;
    }

    const newCampaignData = {
        name: campaignName,
        text: campaignText,
        baseFile: campaignBaseFile,
    };
    
    const result = await createCampaignAction(newCampaignData);

    if (result.success) {
        toast({
            title: "Успех!",
            description: `Рассылка "${campaignName}" отправлена на модерацию.`
        });
        resetForm();
        setIsOpen(false);
        router.push('/campaigns'); // Redirect to see all campaigns
    } else {
         toast({
            variant: "destructive",
            title: "Ошибка",
            description: result.message || "Не удалось создать рассылку."
        });
    }
    setIsSubmitting(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle className="font-headline text-xl">Заказать рассылку</DialogTitle>
            <DialogDescription>
                Заполните детали рассылки и отправьте ее на модерацию.
            </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                 <div className="grid w-full gap-2">
                    <Label htmlFor="name">Название рассылки</Label>
                    <Input 
                        id="name" 
                        placeholder="Например, 'Весенняя распродажа'" 
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        required
                    />
                    </div>
                    <div className="grid w-full gap-2">
                    <Label htmlFor="text">Текст рассылки</Label>
                    <Textarea 
                        id="text" 
                        placeholder="Введите текст вашей рассылки здесь..." 
                        rows={10} 
                        value={campaignText}
                        onChange={(e) => setCampaignText(e.target.value)}
                        required
                    />
                    </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row sm:justify-between sm:items-center">
                 <div className="flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".csv, .txt, .json"
                    />
                    <Button type="button" variant="outline" onClick={handleAttachClick}>
                        <Paperclip className={cn("mr-2 h-4 w-4", campaignBaseFile && "text-primary")} />
                        {campaignBaseFile ? campaignBaseFile.name : "Прикрепить базу"}
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                     <DialogClose asChild><Button type="button" variant="outline">Отмена</Button></DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                        <Send className="mr-2 h-4 w-4" />
                        {isSubmitting ? "Отправка..." : "Отправить на модерацию"}
                    </Button>
                </div>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
