
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
import { auth } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/providers/auth-provider";
import React, { useEffect, useState } from 'react';

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!auth) {
      toast({ variant: 'destructive', title: 'Ошибка', description: 'Сервис аутентификации не доступен.' });
      setIsSubmitting(false);
      return;
    }
    
    if (isLoginView) {
      // Handle Login
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Вход выполнен успешно!', description: 'Добро пожаловать!' });
        router.push('/dashboard');
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Ошибка входа', description: 'Неверный email или пароль.' });
      }

    } else {
      // Handle Sign Up
      if (password.length < 6) {
        toast({ variant: 'destructive', title: 'Ошибка регистрации', description: 'Пароль должен содержать не менее 6 символов.' });
        setIsSubmitting(false);
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        toast({ title: 'Регистрация успешна!', description: `Добро пожаловать, ${name}!` });
        router.push('/dashboard');
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          toast({ variant: 'destructive', title: 'Ошибка регистрации', description: 'Этот email уже зарегистрирован.' });
        } else {
          toast({ variant: 'destructive', title: 'Ошибка регистрации', description: error.message });
        }
      }
    }

    setIsSubmitting(false);
  }

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);


  if (loading || user) {
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
              <h1 className="text-2xl font-bold font-headline text-primary">
                Elsender
              </h1>
          </div>
          <CardTitle className="text-2xl text-center font-headline">{isLoginView ? 'Войти в аккаунт' : 'Создать аккаунт'}</CardTitle>
          <CardDescription className="text-center">
            {isLoginView ? 'Введите ваши учетные данные для доступа к платформе' : 'Заполните форму для регистрации'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              {!isLoginView && (
                 <div className="grid gap-2">
                    <Label htmlFor="name">
                      <User className="inline-block mr-2 h-4 w-4" />
                      Имя
                    </Label>
                    <Input id="name" placeholder="Иван" required value={name} onChange={(e) => setName(e.target.value)} />
                 </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">
                  <User className="inline-block mr-2 h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">
                    <KeyRound className="inline-block mr-2 h-4 w-4" />
                    Пароль
                  </Label>
                  {isLoginView && <Link href="#" className="ml-auto inline-block text-sm underline">Забыли пароль?</Link>}
                </div>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                 {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                 {isLoginView ? 'Войти' : 'Зарегистрироваться'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            {isLoginView ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <button onClick={() => setIsLoginView(!isLoginView)} className="underline">
               {isLoginView ? "Зарегистрироваться" : "Войти"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
