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
        <SidebarMenuButton href="#" isActive={isActive("/")} tooltip="Dashboard">
          <LayoutDashboard />
          Dashboard
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          href="#"
          isActive={isActive("/campaigns")}
          tooltip="Campaigns"
        >
          <MessageSquareQuote />
          Campaigns
        </SidebarMenuButton>
      </SidebarMenuItem>
       <SidebarMenuItem>
        <SidebarMenuButton
          href="#"
          isActive={isActive("/analytics")}
          tooltip="Analytics"
        >
          <BarChart3 />
          Analytics
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          href="#"
          isActive={isActive("/contacts")}
          tooltip="Contacts"
        >
          <Users />
          Contacts
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          href="#"
          isActive={isActive("/settings")}
          tooltip="Settings"
        >
          <Settings />
          Settings
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
