
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
import { Clipboard, ClipboardCheck, Link as LinkIcon, Bot } from "lucide-react";

const initialState: ClientLinkFormState = {
  message: null,
  errors: null,
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <Bot className="mr-2 h-4 w-4 animate-spin" />
          Генерация...
        </>
      ) : (
        "Сгенерировать ссылку"
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

  useEffect(() => {
    if (state.message === "Ссылка успешно сгенерирована!") {
      toast({
        title: "Успех!",
        description: "Ссылка для клиента была успешно создана.",
      });
      formRef.current?.reset();
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
        <CardTitle className="font-headline">Создать рассылку</CardTitle>
        <CardDescription>
          Вставьте ссылку на CSV из Google Таблиц, укажите название и количество сообщений, чтобы сгенерировать ссылку для клиента.
        </CardDescription>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csvUrl">Ссылка на CSV</Label>
            <Input
              id="csvUrl"
              name="csvUrl"
              placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv"
              required
            />
            {state.errors?.csvUrl && (
              <p className="text-sm text-destructive">{state.errors.csvUrl[0]}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaignName">Название рассылки</Label>
              <Input
                id="campaignName"
                name="campaignName"
                placeholder="Например, 'Новогодняя акция'"
                required
              />
              {state.errors?.campaignName && (
                <p className="text-sm text-destructive">{state.errors.campaignName[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="messageCount">Количество сообщений</Label>
              <Input
                id="messageCount"
                name="messageCount"
                type="number"
                placeholder="Например, 1000"
                required
              />
              {state.errors?.messageCount && (
                <p className="text-sm text-destructive">{state.errors.messageCount[0]}</p>
              )}
            </div>
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
