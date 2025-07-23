
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Rocket } from 'lucide-react';
import { useAuthContext } from '@/providers/auth-provider';
import CreateCampaignDialog from './create-campaign-dialog';

export default function WelcomeDashboard() {
  const { user } = useAuthContext();

  return (
    <div className="flex items-center justify-center w-full min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
        <CardHeader>
          <Rocket className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-2xl font-headline">
            Здравствуйте, {user?.name || 'пользователь'}!
          </CardTitle>
          <CardDescription className="text-lg">
            Добро пожаловать в Elsender. Ваш кабинет готов к работе.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Чтобы запустить вашу первую рассылку и начать привлекать клиентов, нажмите на зелёную кнопку ниже или в правом верхнем углу.
          </p>
          <CreateCampaignDialog>
            <Button size="lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              Создать первую рассылку
            </Button>
          </CreateCampaignDialog>
        </CardContent>
      </Card>
    </div>
  );
}
