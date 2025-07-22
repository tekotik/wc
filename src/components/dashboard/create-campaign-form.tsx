
// This file is no longer used and can be removed in the future.
// The functionality has been moved to `create-campaign-dialog.tsx`.
"use client";

import React, { useEffect, useRef } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateClientLinkAction, type ClientLinkFormState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Clipboard, ClipboardCheck, Link as LinkIcon, Bot, Calendar as CalendarIcon, Tag, List, Link2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";


const initialState: ClientLinkFormState = {
  message: null,
  errors: null,
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Bot className="mr-2 h-4 w-4 animate-spin" />
          Создание...
        </>
      ) : (
        "Создать и запустить"
      )}
    </Button>
  );
}

function CopyButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy link">
      {copied ? (
        <ClipboardCheck className="h-5 w-5 text-green-500" />
      ) : (
        <Clipboard className="h-5 w-5" />
      )}
    </Button>
  );
}

export default function CreateCampaignForm() {
  const [state, formAction] = useActionState(generateClientLinkAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState<string>("");

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

  useEffect(() => {
    if (state.message === "Рассылка успешно создана и запущена!") {
      toast({
        title: "Успех!",
        description: `Рассылка "${state.data?.campaignName}" создана и будет запущена ${state.data?.scheduledAt}.`,
      });
      formRef.current?.reset();
      setDate(undefined);
      setTime("");
    } else if (state.errors?.server) {
      toast({
        variant: "destructive",
        title: "Ой! Что-то пошло не так.",
        description: state.errors.server,
      });
    }
  }, [state, toast]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline">Создать ссылку для клиента</CardTitle>
        <CardDescription>
          Заполните поля, чтобы сгенерировать уникальную ссылку и добавить рассылку.
        </CardDescription>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent className="space-y-4">
           {/* Ссылка на CSV */}
           <div className="space-y-2">
            <Label htmlFor="csvUrl" className="flex items-center gap-2"><Link2 className="h-4 w-4 text-muted-foreground" />Ссылка на CSV из Google Таблиц</Label>
            <Input
              id="csvUrl"
              name="csvUrl"
              placeholder="Вставьте ссылку..."
              required
            />
            {state.errors?.csvUrl && (
              <p className="text-sm text-destructive">{state.errors.csvUrl[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Название рассылки */}
            <div className="space-y-2">
              <Label htmlFor="campaignName" className="flex items-center gap-2"><Tag className="h-4 w-4 text-muted-foreground" />Название рассылки</Label>
              <Input
                id="campaignName"
                name="campaignName"
                placeholder="Например, 'Летняя акция'"
                required
              />
              {state.errors?.campaignName && (
                <p className="text-sm text-destructive">{state.errors.campaignName[0]}</p>
              )}
            </div>
            {/* Количество сообщений */}
            <div className="space-y-2">
              <Label htmlFor="messageCount" className="flex items-center gap-2"><List className="h-4 w-4 text-muted-foreground" />Количество сообщений</Label>
              <Input
                id="messageCount"
                name="messageCount"
                type="number"
                placeholder="Например, 1500"
                required
              />
              {state.errors?.messageCount && (
                <p className="text-sm text-destructive">{state.errors.messageCount[0]}</p>
              )}
            </div>
          </div>
          
           {/* Дата и время */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-muted-foreground" />Дата и время рассылки</Label>
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
            {state.errors?.scheduledAt && (
              <p className="text-sm text-destructive">{state.errors.scheduledAt[0]}</p>
            )}
             <input type="hidden" name="scheduledAt" ref={hiddenDateRef} />
          </div>

        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
      {state.data && (
        <CardContent>
          <Alert>
             <LinkIcon className="h-4 w-4" />
            <AlertTitle className="font-headline">Ссылка для вашего клиента</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>
                Рассылка <strong>"{state.data.campaignName}"</strong> будет запущена: <strong>{state.data.scheduledAt}</strong>
              </p>
              <div className="flex items-center justify-between p-3 rounded-md bg-secondary">
                  <code className="text-sm text-secondary-foreground font-mono break-all">{state.data.clientLink}</code>
                  <CopyButton textToCopy={state.data.clientLink} />
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
}
