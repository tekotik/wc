
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, ArrowLeft, Link as LinkIcon, List, Calendar as CalendarIcon, User, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import type { Request as RequestType } from "@/lib/request-service";
import type { Campaign } from "@/lib/mock-data";
import { updateRequestAction } from "@/app/admin/actions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AdminEditCampaignFormProps {
    request: RequestType;
    user: { name?: string; email?: string; } | null;
}

export default function AdminEditCampaignForm({ request, user }: AdminEditCampaignFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    
    // Parse initial campaign details from the request description
    const initialDetails = JSON.parse(request.description);

    const [campaignName, setCampaignName] = useState(initialDetails.name);
    const [campaignText, setCampaignText] = useState(initialDetails.text);
    const [baseFileName] = useState(initialDetails.baseFile?.name || 'Файл не прикреплен');
    const [repliesCsvUrl, setRepliesCsvUrl] = useState('');
    const [validNumbers, setValidNumbers] = useState('');

    const [date, setDate] = useState<Date | undefined>();
    const [time, setTime] = useState<string>("");
    const hiddenDateRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (date && time) {
            const [hours, minutes] = time.split(':');
            const combinedDate = new Date(date);
            combinedDate.setHours(Number(hours), Number(minutes));
            if (hiddenDateRef.current) {
                hiddenDateRef.current.value = combinedDate.toISOString();
            }
        }
    }, [date, time]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Construct the full description for the campaign to be created
        const campaignDetails = {
            ...initialDetails,
            name: campaignName,
            text: campaignText,
            repliesCsvUrl: repliesCsvUrl,
            scheduledAt: hiddenDateRef.current?.value,
            validNumbers: validNumbers,
        };
        
        const result = await updateRequestAction({ 
            id: request.id, 
            status: 'approved', 
            admin_comment: 'Одобрено',
            description: JSON.stringify(campaignDetails) // Pass all data to the action
        });

        if (result.success) {
            toast({
                title: "Успех!",
                description: `Заявка #${request.id} одобрена и рассылка создана.`
            });
            router.push('/admin');
        } else {
             toast({
                variant: "destructive",
                title: "Ошибка",
                description: result.message || "Не удалось одобрить заявку."
            });
        }
    };
    
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
                Модерация заявки #{request.id}
            </h1>
            </div>
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="font-headline">Проверка и одобрение рассылки</CardTitle>
                        <CardDescription>Отредактируйте детали, одобрите и установите время запуска.</CardDescription>
                         <div className="pt-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <strong>Пользователь:</strong> {user?.name || 'Неизвестно'} ({request.user_id})
                            </div>
                             <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <strong>Email:</strong> {user?.email || 'Неизвестно'}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid w-full gap-2">
                            <Label htmlFor="name">Название рассылки</Label>
                            <Input 
                                id="name" 
                                value={campaignName}
                                onChange={(e) => setCampaignName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid w-full gap-2">
                            <Label htmlFor="text">Текст рассылки</Label>
                            <Textarea 
                                id="text" 
                                rows={8} 
                                value={campaignText}
                                onChange={(e) => setCampaignText(e.target.value)}
                                required
                            />
                        </div>
                         <div className="grid w-full gap-2">
                            <Label>Прикрепленный файл с базой</Label>
                            <Input 
                                value={baseFileName}
                                disabled
                                className="italic"
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
                                value={repliesCsvUrl}
                                onChange={(e) => setRepliesCsvUrl(e.target.value)}
                                placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv"
                                required
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
                                    value={validNumbers}
                                    onChange={(e) => setValidNumbers(e.target.value)}
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
