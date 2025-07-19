
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
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  unreadCount?: number;
}

export default function SidebarNav({ unreadCount = 0 }: SidebarNavProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path) && (path !== '/dashboard' || pathname === '/dashboard');
  const hasUnread = unreadCount > 0;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
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
            Рассылки
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
          isActive={isActive("/admin")}
        >
          <Link href="/admin">
            <Shield />
            Админка
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
