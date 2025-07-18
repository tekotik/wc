
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateMessagesAction, type FormState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Bot, Clipboard, ClipboardCheck } from "lucide-react";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState: FormState = {
  message: null,
  errors: null,
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? (
        <>
          <Bot className="mr-2 h-4 w-4 animate-spin" />
          Генерация...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-4 w-4" />
          Сгенерировать сообщения
        </>
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
        <Button variant="ghost" size="icon" onClick={handleCopy}>
            {copied ? <ClipboardCheck className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
        </Button>
    );
}

export default function AiMessageGenerator() {
  const [state, formAction] = useActionState(generateMessagesAction, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (state.message === "Success!") {
      toast({
        title: "Сообщения сгенерированы!",
        description: "Ваши новые варианты сообщений готовы.",
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
        <CardTitle className="font-headline">AI Генератор сообщений</CardTitle>
        <CardDescription>
          Опишите свою кампанию, и ИИ создаст для вас привлекательные варианты сообщений.
        </CardDescription>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="campaignDetails">Детали кампании</Label>
            <Textarea
              id="campaignDetails"
              name="campaignDetails"
              placeholder="Например, распродажа нашей новой летней коллекции, целевая аудитория — молодые люди 18-25 лет. Ключевое сообщение: 'Скидка 50% только 48 часов'."
              rows={5}
              required
            />
            {state.errors?.campaignDetails && (
              <p className="text-sm text-destructive">{state.errors.campaignDetails[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="numberOfVariations">Количество вариантов (1-5)</Label>
            <Input
              id="numberOfVariations"
              name="numberOfVariations"
              type="number"
              defaultValue="3"
              min="1"
              max="5"
            />
             {state.errors?.numberOfVariations && (
              <p className="text-sm text-destructive">{state.errors.numberOfVariations[0]}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
      {state.data && (
        <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold font-headline">Сгенерированные варианты</h3>
            <div className="space-y-3">
            {state.data.map((variation, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg bg-secondary/50">
                    <p className="flex-1 text-sm">{variation}</p>
                    <CopyButton textToCopy={variation} />
                </div>
            ))}
            </div>
        </CardContent>
      )}
    </Card>
  );
}
