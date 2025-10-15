"use client"

import { IconDashboard, IconLogout, IconSettings, IconShieldFill } from "@intentui/icons"
import { useScopedI18n } from "@/locales/client"
import { logout } from "@/app/[locale]/actions"
import { Avatar } from "@/components/ui/avatar"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import {
  Menu,
  MenuContent,
  MenuHeader,
  MenuItem,
  MenuLabel,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu"
import { SidebarNav, SidebarTrigger } from "@/components/ui/sidebar"

interface AppSidebarNavProps {
  user?: {
    name?: string | null
    email?: string | null
  }
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
}

export default function AppSidebarNav({ user, breadcrumbs }: AppSidebarNavProps) {
  const tShared = useScopedI18n("shared")

  return (
    <SidebarNav>
      <span className="flex items-center gap-x-4">
        <SidebarTrigger className="-ml-2" />
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs className="hidden md:flex">
            {breadcrumbs.map((crumb, index) => (
              <Breadcrumbs.Item key={index} href={crumb.href}>
                {crumb.label}
              </Breadcrumbs.Item>
            ))}
          </Breadcrumbs>
        )}
      </span>
      <UserMenu user={user} tShared={tShared} />
    </SidebarNav>
  )
}

interface UserMenuProps {
  user?: {
    name?: string | null
    email?: string | null
  }
  tShared: any
}

function UserMenu({ user, tShared }: UserMenuProps) {
  const handleLogout = async () => {
    await logout()
  }

  return (
    <Menu>
      <MenuTrigger className="ml-auto md:hidden" aria-label="Open Menu">
        <Avatar
          isSquare
          initials={user?.name?.charAt(0).toUpperCase() || "A"}
        />
      </MenuTrigger>
      <MenuContent popover={{ placement: "bottom end" }} className="min-w-64">
        <MenuSection>
          <MenuHeader separator>
            <span className="block">{user?.name || "Admin"}</span>
            <span className="font-normal text-muted-fg">{user?.email || "admin@example.com"}</span>
          </MenuHeader>
        </MenuSection>
        <MenuItem href="/admin">
          <IconDashboard />
          <MenuLabel>{tShared("sidebar.dashboard")}</MenuLabel>
        </MenuItem>
        <MenuItem href="/settings">
          <IconSettings />
          <MenuLabel>{tShared("settings")}</MenuLabel>
        </MenuItem>
        <MenuItem href="/settings#security">
          <IconShieldFill />
          <MenuLabel>{tShared("sidebar.security")}</MenuLabel>
        </MenuItem>
        <MenuSeparator />
        <MenuItem onAction={handleLogout}>
          <IconLogout />
          <MenuLabel>{tShared("logout")}</MenuLabel>
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
