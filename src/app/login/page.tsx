
'use client';

import { ElsenderLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, KeyRound, Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction, signupAction } from './actions';
import { getSessionUser } from "./actions";

function SubmitButton({ isLogin }: { isLogin: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {pending ? (isLogin ? 'Вход...' : 'Создание...') : (isLogin ? 'Войти' : 'Создать аккаунт')}
        </Button>
    );
}

function LoginForm() {
  const { toast } = useToast();

  const [state, formAction] = useActionState(async (_prevState: any, formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const result = await loginAction({ email, password });
    if (!result.success) {
      toast({ variant: 'destructive', title: 'Ошибка входа', description: result.message });
    }
    return result;
  }, { success: false, message: '' });

  return (
    <form action={formAction}>
      <div className="grid gap-4">
        <div className="grid gap-2">
           <Label htmlFor="email"><User className="inline-block mr-2 h-4 w-4" />Email</Label>
           <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password"><KeyRound className="inline-block mr-2 h-4 w-4" />Пароль</Label>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        <SubmitButton isLogin={true} />
      </div>
    </form>
  );
}

function SignupForm() {
  const { toast } = useToast();

  const [state, formAction] = useActionState(async (_prevState: any, formData: FormData) => {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const result = await signupAction({ name, email, password });
     if (!result.success) {
      toast({ variant: 'destructive', title: 'Ошибка регистрации', description: result.message });
    }
    return result;
  }, { success: false, message: '' });

  return (
    <form action={formAction}>
      <div className="grid gap-4">
        <div className="grid gap-2">
            <Label htmlFor="name"><UserPlus className="inline-block mr-2 h-4 w-4" />Имя</Label>
            <Input id="name" name="name" placeholder="Ваше имя" required />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="email"><User className="inline-block mr-2 h-4 w-4" />Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password"><KeyRound className="inline-block mr-2 h-4 w-4" />Пароль</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <SubmitButton isLogin={false} />
      </div>
    </form>
  );
}


export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginView, setIsLoginView] = useState(true);

  useEffect(() => {
    getSessionUser().then(sessionUser => {
      if (sessionUser) {
        router.push('/dashboard');
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
            <div className="flex items-center justify-center gap-2 mb-4">
              <ElsenderLogo className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold font-headline text-primary">Elsender</h1>
            </div>
            <CardTitle className="text-2xl text-center font-headline">
              {isLoginView ? 'Войти в аккаунт' : 'Создать аккаунт'}
            </CardTitle>
            <CardDescription className="text-center">
                {isLoginView ? 'Введите свои данные для входа.' : 'Заполните форму для регистрации.'}
            </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoginView ? <LoginForm /> : <SignupForm />}
            <div className="mt-4 text-center text-sm">
                {isLoginView ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                <Button variant="link" onClick={() => setIsLoginView(!isLoginView)} className="px-1">
                    {isLoginView ? 'Зарегистрироваться' : 'Войти'}
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
