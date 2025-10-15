"use client"

import * as React from "react"
import { Calendar, Upload, LayoutDashboard, Users } from "lucide-react"
import { usePathname } from "next/navigation"
import { useScopedI18n } from "@/locales/client"
import { logout } from "@/app/[locale]/actions"
import {
  IconChevronsY,
  IconDashboardFill,
  IconLogout,
  IconSettingsFill,
  IconShieldFill,
} from "@intentui/icons"
import { Avatar } from "@/components/ui/avatar"
import { Link } from "@/components/ui/link"
import {
  Menu,
  MenuContent,
  MenuHeader,
  MenuItem,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarRail,
  SidebarSection,
  SidebarSectionGroup,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name?: string | null
    email?: string | null
  }
}

export default function AppSidebar({ user, ...props }: AppSidebarProps) {
  const tDashboard = useScopedI18n("admin.dashboard")
  const tLobbies = useScopedI18n("admin.lobbies")
  const tShared = useScopedI18n("shared")
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
  }

  const menuItems = [
    {
      title: tShared("sidebar.dashboard"),
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
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href="/admin" className="flex items-center gap-x-2">
          <LayoutDashboard className="size-8" />
          <SidebarLabel className="font-medium">{tShared("sidebar.adminPanel")}</SidebarLabel>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarSectionGroup>
          <SidebarSection label={tDashboard("quickActions.title")}>
            {menuItems.map((item) => (
              <SidebarItem
                key={item.url}
                href={item.url}
                isCurrent={pathname === item.url}
                tooltip={item.title}
              >
                <item.icon className="size-4" />
                <SidebarLabel>{item.title}</SidebarLabel>
              </SidebarItem>
            ))}
          </SidebarSection>
        </SidebarSectionGroup>
      </SidebarContent>

      <SidebarFooter className="flex flex-row justify-between gap-4 group-data-[state=collapsed]:flex-col">
        <Menu>
          <MenuTrigger className="flex w-full items-center justify-between" aria-label="Profile">
            <div className="flex items-center gap-x-2">
              <Avatar
                className="size-8 *:size-8 group-data-[state=collapsed]:size-6 group-data-[state=collapsed]:*:size-6"
                isSquare
                initials={user?.name?.charAt(0).toUpperCase() || "A"}
              />

              <div className="in-data-[collapsible=dock]:hidden text-sm">
                <SidebarLabel>{user?.name || "Admin"}</SidebarLabel>
                <span className="-mt-0.5 block text-muted-fg">{user?.email || "admin@example.com"}</span>
              </div>
            </div>
            <IconChevronsY data-slot="chevron" />
          </MenuTrigger>
          <MenuContent
            className="in-data-[sidebar-collapsible=collapsed]:min-w-56 min-w-(--trigger-width)"
            placement="bottom right"
          >
            <MenuSection>
              <MenuHeader separator>
                <span className="block">{user?.name || "Admin"}</span>
                <span className="font-normal text-muted-fg">{user?.email || "admin@example.com"}</span>
              </MenuHeader>
            </MenuSection>

            <MenuItem href="/admin">
              <IconDashboardFill />
              {tShared("sidebar.dashboard")}
            </MenuItem>
            <MenuItem href="/settings">
              <IconSettingsFill />
              {tShared("settings")}
            </MenuItem>
            <MenuItem href="/settings#security">
              <IconShieldFill />
              {tShared("sidebar.security")}
            </MenuItem>
            <MenuSeparator />
            <MenuItem onAction={handleLogout}>
              <IconLogout />
              {tShared("logout")}
            </MenuItem>
          </MenuContent>
        </Menu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
