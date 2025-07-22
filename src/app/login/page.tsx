
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
import React, { useState, useEffect } from 'react';
import { login, signup } from './actions';
import { getSessionUser } from "./actions";

function LoginForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const response = await login({ email, password });
    if (response.success) {
      toast({ title: response.message });
      // Full page reload to ensure session is picked up
      window.location.href = '/dashboard'; 
    } else {
      toast({ variant: 'destructive', title: 'Ошибка входа', description: response.message });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email"><User className="inline-block mr-2 h-4 w-4" />Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password"><KeyRound className="inline-block mr-2 h-4 w-4" />Пароль</Label>
          </div>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Войти
        </Button>
      </div>
    </form>
  );
}

function SignupForm() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const response = await signup({ name, email, password });
    if (response.success) {
      toast({ title: response.message });
      // Full page reload to ensure session is picked up and user is logged in
      window.location.href = '/dashboard'; 
    } else {
      toast({ variant: 'destructive', title: 'Ошибка регистрации', description: response.message });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div className="grid gap-2">
            <Label htmlFor="name"><UserPlus className="inline-block mr-2 h-4 w-4" />Имя</Label>
            <Input id="name" placeholder="Ваше имя" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email"><User className="inline-block mr-2 h-4 w-4" />Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password"><KeyRound className="inline-block mr-2 h-4 w-4" />Пароль</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Создать аккаунт
        </Button>
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
