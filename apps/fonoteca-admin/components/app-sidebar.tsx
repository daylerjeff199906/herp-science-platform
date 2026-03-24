'use client'

import * as React from 'react'
import { AudioLinesIcon, ClipboardListIcon, FrameIcon, GalleryVerticalEndIcon, LayersIcon, Leaf, MapIcon, PieChartIcon, TerminalIcon } from 'lucide-react'

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




const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: (
        <GalleryVerticalEndIcon
        />
      ),
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: (
        <AudioLinesIcon
        />
      ),
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: (
        <TerminalIcon
        />
      ),
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Taxonomía",
      url: "#",
      icon: <LayersIcon />,
      isActive: true,
      items: [
        {
          title: "Catálogo de Taxones",
          url: "/dashboard/taxa",
        },
      ],
    },
    {
      title: "Geografía",
      url: "#",
      icon: <MapIcon />,
      items: [
        {
          title: "Ubicaciones",
          url: "/dashboard/locations",
        },
      ],
    },
    {
      title: "Monitoreo",
      url: "#",
      icon: <ClipboardListIcon />,
      items: [
        {
          title: "Lista de Ocurrencias",
          url: "/dashboard/occurrences",
        },
      ],
    },
    {
      title: "Mediateca",
      url: "#",
      icon: <AudioLinesIcon />,
      items: [
        {
          title: "Archivos Multimedia",
          url: "/dashboard/multimedia",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: (
        <FrameIcon
        />
      ),
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: (
        <PieChartIcon
        />
      ),
    },
    {
      name: "Travel",
      url: "#",
      icon: (
        <MapIcon
        />
      ),
    },
  ],
}

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


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

