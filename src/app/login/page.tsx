
'use client';

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginFormState, autoLoginAdminAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      // Redirect on success
      router.push(state.redirectUrl || '/dashboard');
    } else if (state.message) {
      toast({
        variant: "destructive",
        title: "Ошибка входа",
        description: state.message,
      });
    }
  }, [state, router, toast]);

  const handleAutoLogin = async () => {
    const result = await autoLoginAdminAction();
    if (result.success) {
        router.push(result.redirectUrl!);
    } else {
         toast({
            variant: "destructive",
            title: "Ошибка авто-входа",
            description: result.message,
        });
    }
  }

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
                  <Label htmlFor="login">Логин</Label>
                  <Input id="login" name="login" type="text" placeholder="m@example.com" required/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Пароль</Label>
                <Input id="password" name="password" type="password" required/>
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
            <div className="mt-4 text-center text-sm">
                <Button variant="link" onClick={handleAutoLogin}>
                    Автоматический вход для администратора
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
