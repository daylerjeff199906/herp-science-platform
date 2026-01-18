'use strict'

import * as React from 'react'

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
import { LucideIcon } from 'lucide-react'

// Define types for the props
interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

interface Team {
  name: string
  logo: React.ElementType
  plan: string
}

interface Project {
  name: string
  url: string
  icon: LucideIcon
}

interface User {
  name: string
  email: string
  avatar: string
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User
  teams?: Team[]
  navMain: NavItem[]
  projects?: Project[]
}

export function AppSidebar({
  user,
  teams,
  navMain,
  projects,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {teams && <TeamSwitcher teams={teams} />}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {projects && <NavProjects projects={projects} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
