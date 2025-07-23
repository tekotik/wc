
"use client";

import { usePathname } from "next/navigation";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  MessageSquareQuote,
  LifeBuoy,
  Shield,
  MessagesSquare,
  BarChart3,
  History,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/providers/auth-provider";

interface SidebarNavProps {
  unreadCount?: number;
}

export default function SidebarNav({ unreadCount = 0 }: SidebarNavProps) {
  const pathname = usePathname();
  const { user } = useAuthContext();
  const isAdmin = user?.role === 'admin';
  
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };
  
  const hasUnread = unreadCount > 0;

  if (isAdmin) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/in-progress")}>
                <Link href="/in-progress">
                    <History />
                    В работе
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // --- User-facing menu ---
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
          <Link href="/dashboard">
            <LayoutDashboard />
            Панель управления
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
       <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive("/campaigns")}
        >
          <Link href="/campaigns">
            <MessageSquareQuote />
            Все рассылки
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
       <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive("/analytics")}
        >
          <Link href="/analytics">
            <BarChart3 />
            Аналитика
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive("/replies")}
          tooltip="Ответы"
        >
          <Link href="/replies">
            <MessagesSquare />
            Ответы
            {hasUnread && <SidebarMenuBadge>{unreadCount}</SidebarMenuBadge>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          href="#"
          isActive={isActive("/support")}
          tooltip="Тех поддержка"
        >
          <LifeBuoy />
          Тех поддержка
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
