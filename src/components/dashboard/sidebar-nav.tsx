"use client";

import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  MessageSquareQuote,
  Users,
  Settings,
  BarChart3,
  ChevronDown,
} from "lucide-react";
import * as React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function SidebarNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton href="/" isActive={isActive("/")} tooltip="Панель управления">
          <LayoutDashboard />
          Панель управления
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          href="/campaigns"
          isActive={isActive("/campaigns")}
          tooltip="Кампании"
        >
          <MessageSquareQuote />
          Кампании
        </SidebarMenuButton>
      </SidebarMenuItem>
       <SidebarMenuItem>
        <SidebarMenuButton
          href="#"
          isActive={isActive("/analytics")}
          tooltip="Аналитика"
        >
          <BarChart3 />
          Аналитика
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          href="#"
          isActive={isActive("/contacts")}
          tooltip="Контакты"
        >
          <Users />
          Контакты
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          href="#"
          isActive={isActive("/settings")}
          tooltip="Настройки"
        >
          <Settings />
          Настройки
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
