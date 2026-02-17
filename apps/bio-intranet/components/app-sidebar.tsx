'use client'

import * as React from 'react'
import { Leaf } from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useTranslations } from 'next-intl'
import { getNavItems, getNavProjects } from '@/lib/constants/navigation'

// Team data for the switcher
const teams = [
  {
    name: 'IIAP',
    logo: Leaf,
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
  const t = useTranslations()

  // Get navigation items with translations
  const navMain = getNavItems(t)

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
