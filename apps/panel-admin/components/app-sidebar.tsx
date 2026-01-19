'use strict'

import * as React from 'react'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Command } from 'lucide-react'
import { IconName } from './icon-map'

// Define types for the props
interface NavItem {
  title: string
  url: string
  icon?: IconName
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}


interface Project {
  name: string
  url: string
  icon: IconName
}

interface User {
  name: string
  email: string
  avatar: string
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User
  navMain: NavItem[]
  projects?: Project[]
}

export function AppSidebar({
  user,
  navMain,
  projects,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Panel Admin</span>
                  <span className="truncate text-xs">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
