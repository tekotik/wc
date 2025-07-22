
"use client";

import {
  Bell,
  Wallet,
  PlusCircle,
  User,
  LogOut,
  Settings,
  LifeBuoy
} from "lucide-react";
import { cn } from "@/lib/utils"
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
import TopUpBalanceDialog from "./top-up-balance-dialog";
import React from 'react';
import Link from "next/link";
import { useAuthContext } from "@/providers/auth-provider";
import CreateCampaignDialog from "./create-campaign-dialog";
import { logout } from "@/app/login/actions";


export default function DashboardHeader({ unreadCount }: { unreadCount?: number }) {
  const [balance, setBalance] = React.useState(1000);
  const hasUnreadReplies = (unreadCount ?? 0) > 0;
  const { user } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login'; // Force a full page reload to clear state
  };

  const getInitials = (name?: string | null) => {
    if (!name) return <User className="h-5 w-5 text-foreground" />;
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };


  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
      <div className="w-full flex-1">
        {/* The create button is now part of the main dashboard form. */}
      </div>
      <div className="flex items-center gap-2">
        <CreateCampaignDialog>
          <Button>
            <PlusCircle className="mr-2" />
            Заказать рассылку
          </Button>
        </CreateCampaignDialog>

        <TopUpBalanceDialog balance={balance} setBalance={setBalance}>
          <Button variant="ghost" className="flex items-center gap-2 p-2">
            <Wallet className="h-5 w-5 text-foreground" />
            <span className="font-bold text-lg text-foreground">{balance} ₽</span>
          </Button>
        </TopUpBalanceDialog>
      </div>
      <Button variant="ghost" size="icon" className="rounded-full relative" asChild>
        <Link href="/replies">
          {hasUnreadReplies && (
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
          )}
          <Bell className="h-5 w-5 text-foreground" />
          <span className="sr-only">Переключить уведомления</span>
        </Link>
      </Button>
      
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Переключить меню пользователя</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><Settings className="mr-2"/>Настройки</DropdownMenuItem>
            <DropdownMenuItem><LifeBuoy className="mr-2"/>Поддержка</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2"/>Выйти</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
