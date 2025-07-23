
'use client';

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { signupAction, type SignupFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const initialState: SignupFormState = {
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
            Создание...
          </>
        ) : 'Создать аккаунт'}
    </Button>
  );
}

export default function SignupPage() {
  const [state, formAction] = useActionState(signupAction, initialState);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Успех!",
        description: "Вы успешно зарегистрированы.",
      });
      // Redirect to dashboard after showing toast
      router.push('/dashboard');
    } else if (state.message) {
      // Don't show toast for initial state message
      if(state.errors) {
         toast({
            variant: "destructive",
            title: "Ошибка регистрации",
            description: state.errors.server || state.message,
        });
      }
    }
  }, [state, toast, router]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-headline">
            Создать аккаунт
          </CardTitle>
          <CardDescription className="text-center">
            Введите свои данные для создания нового аккаунта.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input id="name" name="name" placeholder="Ваше имя" required />
                  {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="m@example.com" required/>
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
                Уже есть аккаунт?
                <Button variant="link" asChild className="px-1">
                    <Link href="/login">
                       Войти
                    </Link>
                </Button>
            </div>
             <div className="mt-2 text-center text-xs">
                <Button variant="link" asChild className="px-1 text-muted-foreground">
                    <Link href="/logs">
                       Посмотреть логи базы данных
                    </Link>
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
