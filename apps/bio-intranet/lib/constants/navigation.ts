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
    title: t('Navigation.members'),
    url: '/members',
    icon: Users,
    items: [
      {
        title: t('Navigation.membersAll'),
        url: '/members',
      },
      {
        title: t('Navigation.membersResearchers'),
        url: '/members/researchers',
      },
      {
        title: t('Navigation.membersStudents'),
        url: '/members/students',
      },
    ],
  },
  {
    title: t('Navigation.publications'),
    url: '/publications',
    icon: BookOpen,
    items: [
      {
        title: t('Navigation.publicationsAll'),
        url: '/publications',
      },
      {
        title: t('Navigation.publicationsMy'),
        url: '/publications/my',
      },
      {
        title: t('Navigation.publicationsAdd'),
        url: '/publications/new',
      },
    ],
  },
  {
    title: t('Navigation.research'),
    url: '/research',
    icon: FlaskConical,
    items: [
      {
        title: t('Navigation.researchProjects'),
        url: '/research/projects',
      },
      {
        title: t('Navigation.researchData'),
        url: '/research/data',
      },
      {
        title: t('Navigation.researchProtocols'),
        url: '/research/protocols',
      },
    ],
  },
  {
    title: t('Navigation.expeditions'),
    url: '/expeditions',
    icon: Map,
    items: [
      {
        title: t('Navigation.expeditionsAll'),
        url: '/expeditions',
      },
      {
        title: t('Navigation.expeditionsPlan'),
        url: '/expeditions/plan',
      },
      {
        title: t('Navigation.expeditionsMap'),
        url: '/expeditions/map',
      },
    ],
  },
  {
    title: t('Navigation.documents'),
    url: '/documents',
    icon: FileText,
  },
  {
    title: t('Navigation.profile'),
    url: '/dashboard/profile',
    icon: User,
  },
  {
    title: t('Navigation.settings'),
    url: '/dashboard/settings',
    icon: Settings,
  },
  {
    title: t('Navigation.help'),
    url: '/help',
    icon: HelpCircle,
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
