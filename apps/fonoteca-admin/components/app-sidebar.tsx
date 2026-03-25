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

// Team data for the switcher
const teams = [
  {
    name: 'Intranet IIAP',
    logo: '/brands/logo-iiap.webp',
    plan: 'Instituto',
  },
]

interface UserData {
  name: string
  email: string
  avatar: string | null
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userData?: UserData | null
}

export function AppSidebar({ userData, ...props }: AppSidebarProps) {
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

