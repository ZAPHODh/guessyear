"use client"

import * as React from "react"
import { Calendar, Upload, LayoutDashboard, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useScopedI18n } from "@/locales/client"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AdminSidebar() {
  const tDashboard = useScopedI18n("admin.dashboard")
  const tLobbies = useScopedI18n("admin.lobbies")
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: tDashboard("quickActions.uploadNew"),
      url: "/admin/images/new",
      icon: Upload,
    },
    {
      title: tDashboard("quickActions.scheduleImages"),
      url: "/admin/images",
      icon: Calendar,
    },
    {
      title: tLobbies("title"),
      url: "/admin/lobbies",
      icon: Users,
    },
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{tDashboard("quickActions.title")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}