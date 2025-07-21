
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
import { User, KeyRound } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/providers/auth-provider";
import React from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useAuthContext();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // The redirect is now handled by the AuthProvider
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      toast({
        variant: "destructive",
        title: "Ошибка входа",
        description: "Не удалось войти через Google. Пожалуйста, попробуйте еще раз.",
      });
    }
  };

  // While loading auth state, you can show a loader or an empty page
  if (loading) {
    return <div>Проверка статуса входа...</div>;
  }
  
  // If user is already logged in, AuthProvider will redirect. 
  // This check can prevent rendering the form for a split second.
  if (user) {
    return null;
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
          <CardTitle className="text-2xl text-center font-headline">Войти в аккаунт</CardTitle>
          <CardDescription className="text-center">
            Введите ваши учетные данные для доступа к платформе
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
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
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">
                  <KeyRound className="inline-block mr-2 h-4 w-4" />
                  Пароль
                </Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Забыли пароль?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Войти
            </Button>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
              Войти через Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Нет аккаунта?{" "}
            <Link href="#" className="underline">
              Зарегистрироваться
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
