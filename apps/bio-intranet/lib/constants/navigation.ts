import {
  LayoutDashboard,
  Users,
  BookOpen,
  FlaskConical,
  Map,
  FileText,
  HelpCircle,
  type LucideIcon,
  User,
  Settings,
  Newspaper,
  Archive,
  Calendar,
} from 'lucide-react'

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export interface NavProject {
  name: string
  url: string
  icon: LucideIcon
}

// Navigation items with translation keys
export const getNavItems = (t: (key: string) => string): NavItem[] => [
  {
    title: t('Navigation.dashboard'),
    url: '/dashboard',
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: t('Navigation.news'),
    url: '/news',
    icon: Newspaper,
  },
  {
    title: t('Navigation.profileScientific'),
    url: '/dashboard/profile',
    icon: User,
  },
  {
    title: t('Navigation.network'),
    url: '/network',
    icon: Users,
    items: [
      {
        title: t('Navigation.networkProjects'),
        url: '/network/projects',
      },
      {
        title: t('Navigation.networkResearch'),
        url: '/network/research',
      },
      {
        title: t('Navigation.networkGroups'),
        url: '/network/groups',
      },
    ],
  },
  {
    title: t('Navigation.collections'),
    url: '/collections',
    icon: Archive,
    items: [
      {
        title: t('Navigation.collectionsExplore'),
        url: '/collections/explore',
      },
      {
        title: t('Navigation.collectionsRequests'),
        url: '/collections/requests',
      },
      {
        title: t('Navigation.collectionsProcedures'),
        url: '/collections/procedures',
      },
    ],
  },
  {
    title: t('Navigation.events'),
    url: '/events',
    icon: Calendar,
    items: [
      {
        title: t('Navigation.eventsCalendar'),
        url: '/events/calendar',
      },
      {
        title: t('Navigation.eventsRegistrations'),
        url: '/events/registrations',
      },
      {
        title: t('Navigation.eventsCertificates'),
        url: '/events/certificates',
      },
    ],
  },
  {
    title: t('Navigation.settings'),
    url: '/settings',
    icon: Settings,
    items: [
      {
        title: t('Navigation.settingsSecurity'),
        url: '/settings/security',
      },
      {
        title: t('Navigation.settingsSupport'),
        url: '/settings/support',
      },
    ],
  },
]

// Quick access projects/sections
export const getNavProjects = (t: (key: string) => string): NavProject[] => [
  {
    name: t('Navigation.projectHerpetology'),
    url: '/projects/herpetology',
    icon: FlaskConical,
  },
  {
    name: t('Navigation.projectOrnithology'),
    url: '/projects/ornithology',
    icon: BookOpen,
  },
  {
    name: t('Navigation.projectConservation'),
    url: '/projects/conservation',
    icon: Map,
  },
]
