
"use client";

import {
  Bell,
  Wallet,
  PlusCircle,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PurchaseCampaignDialog from "./purchase-campaign-dialog";
import TopUpBalanceDialog from "./top-up-balance-dialog";
import React from 'react';
import Link from "next/link";
import { ElsenderLogo } from "../icons";


export default function DashboardHeader({ hasUnreadReplies }: { hasUnreadReplies?: boolean }) {
  const [balance, setBalance] = React.useState(1000);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
      <div className="w-full flex-1">
        <PurchaseCampaignDialog 
          balance={balance} 
          setBalance={setBalance}
        >
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Создать рассылку
          </Button>
        </PurchaseCampaignDialog>
      </div>
      <div className="flex items-center gap-2">
        <TopUpBalanceDialog balance={balance} setBalance={setBalance}>
          <Button variant="ghost" className="flex items-center gap-2 p-2">
            <Wallet className="h-5 w-5 text-foreground" />
            <span className="font-bold text-lg text-foreground">{balance} ₽</span>
          </Button>
        </TopUpBalanceDialog>
      </div>
      <Button variant="ghost" size="icon" className="rounded-full relative">
        {hasUnreadReplies && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
        )}
        <Bell className="h-5 w-5 text-foreground" />
        <span className="sr-only">Переключить уведомления</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-5 w-5 text-foreground" />
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">Переключить меню пользователя</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Настройки</DropdownMenuItem>
          <DropdownMenuItem>Поддержка</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Выйти</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
