
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
import Link from "next/link";
import { User, KeyRound, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from 'react';
import { login, signup } from './actions';
import { useSession } from "@/hooks/use-session";

function LoginForm({ onSwitchToSignup }: { onSwitchToSignup: () => void }) {
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
      window.location.href = '/dashboard';
    } else {
      toast({ variant: 'destructive', title: 'Ошибка входа', description: response.message });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-center gap-2 mb-4">
          <ElsenderLogo className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">Elsender</h1>
        </div>
        <CardTitle className="text-2xl text-center font-headline">Войти в аккаунт</CardTitle>
        <CardDescription className="text-center">Введите ваши учетные данные для доступа к платформе</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email"><User className="inline-block mr-2 h-4 w-4" />Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password"><KeyRound className="inline-block mr-2 h-4 w-4" />Пароль</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">Забыли пароль?</Link>
              </div>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Войти
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Нет аккаунта?{" "}
          <button onClick={onSwitchToSignup} className="underline">Зарегистрироваться</button>
        </div>
      </CardContent>
    </>
  );
}

function SignupForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (password.length < 6) {
      toast({ variant: 'destructive', title: 'Ошибка регистрации', description: 'Пароль должен содержать не менее 6 символов.' });
      setIsSubmitting(false);
      return;
    }
    const response = await signup({ name, email, password });
    if (response.success) {
      toast({
        title: "Регистрация успешна!",
        description: "Теперь вы можете войти в свой аккаунт.",
      });
      onSwitchToLogin();
    } else {
      toast({ variant: 'destructive', title: 'Ошибка регистрации', description: response.message });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-center gap-2 mb-4">
          <ElsenderLogo className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">Elsender</h1>
        </div>
        <CardTitle className="text-2xl text-center font-headline">Создать аккаунт</CardTitle>
        <CardDescription className="text-center">Заполните форму для регистрации</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name"><User className="inline-block mr-2 h-4 w-4" />Имя</Label>
              <Input id="name" placeholder="Иван" required value={name} onChange={(e) => setName(e.target.value)} />
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
              Зарегистрироваться
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Уже есть аккаунт?{" "}
          <button onClick={onSwitchToLogin} className="underline">Войти</button>
        </div>
      </CardContent>
    </>
  );
}


export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading } = useSession();
  const [view, setView] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        {view === 'login' ? (
          <LoginForm onSwitchToSignup={() => setView('signup')} />
        ) : (
          <SignupForm onSwitchToLogin={() => setView('login')} />
        )}
      </Card>
    </div>
  );
}
