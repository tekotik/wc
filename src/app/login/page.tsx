
'use client';

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const initialState: LoginFormState = {
  message: "",
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Вход...
          </>
        ) : 'Войти'}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.success) {
      toast({
        variant: "destructive",
        title: "Ошибка входа",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-headline">
            Вход в аккаунт
          </CardTitle>
          <CardDescription className="text-center">
            Введите свои данные для доступа к панели управления.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                  <Label htmlFor="email">Логин</Label>
                  <Input id="email" name="email" type="text" placeholder="m@example.com или admin5" required/>
                  {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Пароль</Label>
                <Input id="password" name="password" type="password" required/>
                 {state.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
              </div>
              <SubmitButton />
            </div>
          </form>
            <div className="mt-4 text-center text-sm">
                Нет аккаунта?
                <Button variant="link" asChild className="px-1">
                    <Link href="/signup">
                        Зарегистрироваться
                    </Link>
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
