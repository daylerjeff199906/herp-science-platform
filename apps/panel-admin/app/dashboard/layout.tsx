import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import { IconName } from '@/components/icon-map'
import { ROUTES } from '@/config/routes'

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
      title: 'Principal',
      url: '#',
      icon: 'Database',
      items: [
        { title: 'Individuos', url: ROUTES.CORE.INDIVIDUALS },
        { title: 'Identificadores', url: ROUTES.CORE.IDENTIFIERS },
      ],
    },
    {
      title: 'Taxonomía',
      url: '#',
      icon: 'Layers',
      isActive: true,
      items: [
        { title: 'Clases', url: ROUTES.TAXONOMY.CLASSES },
        { title: 'Órdenes', url: ROUTES.TAXONOMY.ORDERS },
        { title: 'Familias', url: ROUTES.TAXONOMY.FAMILIES },
        { title: 'Géneros', url: ROUTES.TAXONOMY.GENERA },
        { title: 'Especies', url: ROUTES.TAXONOMY.SPECIES },
        { title: 'Sexos', url: ROUTES.TAXONOMY.SEXES },
      ],
    },
    {
      title: 'Ubicación',
      url: '#',
      icon: 'Map',
      items: [
        { title: 'Países', url: ROUTES.GEOGRAPHY.COUNTRIES },
        { title: 'Departamentos', url: ROUTES.GEOGRAPHY.DEPARTMENTS },
        { title: 'Provincias', url: ROUTES.GEOGRAPHY.PROVINCES },
        { title: 'Distritos', url: ROUTES.GEOGRAPHY.DISTRICTS },
        { title: 'Localidades', url: ROUTES.GEOGRAPHY.LOCALITIES },
      ],
    },
    {
      title: 'Entidades',
      url: '#',
      icon: 'Landmark',
      items: [
        { title: 'Instituciones', url: ROUTES.ENTITIES.INSTITUTIONS },
        { title: 'Museos', url: ROUTES.ENTITIES.MUSEUMS },
        { title: 'Colectores', url: ROUTES.ENTITIES.COLLECTORS },
        { title: 'Tipos de Bosque', url: ROUTES.ENTITIES.FOREST_TYPES },
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

  const user = {
    name: `${session.data.user.person.firstname} ${session.data.user.person.lastname}`,
    email: session.data.user.person.email,
    avatar: '/avatars/shadcn.jpg',
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} navMain={navMain} />
      {children}
    </SidebarProvider>
  )
}
