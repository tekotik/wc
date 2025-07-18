
import {
  Bell,
  Wallet,
  PlusCircle,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PurchaseCampaignDialog from "./purchase-campaign-dialog";
import TopUpBalanceDialog from "./top-up-balance-dialog";
import React from 'react';

// This is a placeholder for a real state management solution
// In a real app, this would come from a context or a store.
interface HeaderProps {
    setCampaigns?: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function DashboardHeader({ setCampaigns }: HeaderProps) {
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
            // @ts-ignore - a bit of a hack for mock state management
            setCampaigns={setCampaigns}
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
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                    <span className="font-bold text-lg">{balance} ₽</span>
                </Button>
            </TopUpBalanceDialog>
      </div>
      <Button variant="ghost" size="icon" className="rounded-full">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Переключить уведомления</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/40x40" alt="@shadcn" data-ai-hint="man portrait"/>
              <AvatarFallback>UA</AvatarFallback>
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
