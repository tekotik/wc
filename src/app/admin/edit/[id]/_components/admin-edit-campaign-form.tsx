
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, ArrowLeft, CheckCircle, List, Calendar as CalendarIcon, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import type { Campaign } from "@/lib/mock-data";
import { updateCampaignAction } from "@/app/campaigns/actions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function AdminEditCampaignForm({ campaign: initialCampaign }: { campaign: Campaign }) {
    const { toast } = useToast();
    const router = useRouter();
    const [campaign, setCampaign] = useState(initialCampaign);
    
    // Extract initial message count from text and store it in separate state
    const initialMessageCount = initialCampaign.text.match(/Рассылка на (\d+)/)?.[1] || "";
    const [messageCount, setMessageCount] = useState(initialMessageCount);

    const [date, setDate] = useState<Date | undefined>(
        initialCampaign.scheduledAt ? new Date(initialCampaign.scheduledAt) : undefined
    );
    const [time, setTime] = useState<string>(
        initialCampaign.scheduledAt ? format(new Date(initialCampaign.scheduledAt), "HH:mm") : ""
    );
    const hiddenDateRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (date && time) {
            const [hours, minutes] = time.split(':');
            const combinedDate = new Date(date);
            combinedDate.setHours(Number(hours), Number(minutes));
            if (hiddenDateRef.current) {
                hiddenDateRef.current.value = combinedDate.toISOString();
            }
            setCampaign(c => ({...c, scheduledAt: combinedDate.toISOString()}))
        }
    }, [date, time]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Update the campaign text with the latest message count right before submission
        const updatedText = campaign.text.replace(/Рассылка на (\d+) сообщений/, `Рассылка на ${messageCount} сообщений`);

        const updatedCampaign: Campaign = {
            ...campaign,
            text: updatedText,
            status: "Одобрено"
        };
        
        const result = await updateCampaignAction(updatedCampaign);

        if (result.success) {
            toast({
                title: "Успех!",
                description: `Рассылка "${campaign.name}" одобрена и сохранена.`
            });
            router.push('/admin');
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

    const handleValidNumbersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageCount(e.target.value);
    }

    return (
        <>
            <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                <Link href="/admin">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Назад</span>
                </Link>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Редактирование рассылки
            </h1>
            </div>
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="font-headline">{campaign.name}</CardTitle>
                        <CardDescription>Отредактируйте детали, одобрите и установите время запуска.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="grid w-full gap-2">
                            <Label htmlFor="name">Название рассылки</Label>
                            <Input 
                                id="name" 
                                value={campaign.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="grid w-full gap-2">
                            <Label htmlFor="text">Текст рассылки</Label>
                            <Textarea 
                                id="text" 
                                rows={8} 
                                value={campaign.text}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="grid w-full gap-2">
                            <Label htmlFor="repliesCsvUrl" className="flex items-center gap-2">
                                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                Ссылка на CSV с ответами
                            </Label>
                            <Input 
                                id="repliesCsvUrl"
                                name="repliesCsvUrl"
                                value={campaign.repliesCsvUrl || ''}
                                onChange={handleInputChange}
                                placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="validNumbers" className="flex items-center gap-2">
                                    <List className="h-4 w-4 text-muted-foreground" />
                                    Количество «живых» номеров
                                </Label>
                                <Input
                                    id="validNumbers"
                                    name="validNumbers"
                                    type="number"
                                    value={messageCount}
                                    onChange={handleValidNumbersChange}
                                    placeholder="Например, 3425"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date" className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                    Дата и время запуска
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                            >
                                            {date ? format(date, "dd.MM.yyyy") : <span>дд.мм.гггг</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Input 
                                        type="time" 
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="text-muted-foreground"
                                        required
                                    />
                                </div>
                                <input type="hidden" name="scheduledAt" ref={hiddenDateRef} />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">
                           <CheckCircle className="mr-2 h-4 w-4" />
                           Сохранить и одобрить
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </>
    );
}
