'use client'
import * as React from 'react'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { getAdminRoutes } from '@/config/admin-routes'


interface UserData {
  name: string
  email: string
  avatar: string | null
  role: string
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userData?: UserData | null
  teams?: {
    name: string
    logo: string
    plan: string
    url: string
  }[]
}

export function AppSidebar({ userData, teams = [], ...props }: AppSidebarProps) {
  const navMain = getAdminRoutes()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

