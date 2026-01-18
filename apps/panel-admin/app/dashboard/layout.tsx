import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import { IconName } from '@/components/icon-map'

// Define navigation data here (or extract to a config file)
const navMain: {
  title: string
  url: string
  icon: IconName
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}[] = [
  {
    title: 'Playground',
    url: '#',
    icon: 'SquareTerminal',
    isActive: true,
    items: [
      {
        title: 'History',
        url: '#',
      },
      {
        title: 'Starred',
        url: '#',
      },
      {
        title: 'Settings',
        url: '#',
      },
    ],
  },
  {
    title: 'Models',
    url: '#',
    icon: 'Bot',
    items: [
      {
        title: 'Genesis',
        url: '#',
      },
      {
        title: 'Explorer',
        url: '#',
      },
      {
        title: 'Quantum',
        url: '#',
      },
    ],
  },
  {
    title: 'Documentation',
    url: '#',
    icon: 'BookOpen',
    items: [
      {
        title: 'Introduction',
        url: '#',
      },
      {
        title: 'Get Started',
        url: '#',
      },
      {
        title: 'Tutorials',
        url: '#',
      },
      {
        title: 'Changelog',
        url: '#',
      },
    ],
  },
  {
    title: 'Settings',
    url: '#',
    icon: 'Settings2',
    items: [
      {
        title: 'General',
        url: '#',
      },
      {
        title: 'Team',
        url: '#',
      },
      {
        title: 'Billing',
        url: '#',
      },
      {
        title: 'Limits',
        url: '#',
      },
    ],
  },
]

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  // Construct user object from session
  const user = {
    name: `${session.data.user.person.firstname} ${session.data.user.person.lastname}`,
    email: session.data.user.person.email,
    avatar: '/avatars/shadcn.jpg', // Placeholder or from session if available
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} navMain={navMain} />
      {children}
    </SidebarProvider>
  )
}
