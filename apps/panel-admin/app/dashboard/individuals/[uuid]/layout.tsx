
import { Separator } from '@/components/ui/separator'
import { SidebarNav } from '../components/sidebar-nav'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { ROUTES } from '@/config'

const sidebarNavItems = [
  {
    title: 'Información General',
    href: '/edit',
  },
  {
    title: 'Multimedia (Imágenes)',
    href: '/multimedia',
  },
  {
    title: 'Sonidos',
    href: '/audio',
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
  params: Promise<{ uuid: string }>
}

export default async function SettingsLayout({ children, params }: SettingsLayoutProps) {
  const { uuid } = await params

  return (
    <LayoutWrapper
      sectionTitle="Editar Individuo"
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Individuos', href: ROUTES.CORE.INDIVIDUALS },
        { title: 'Editar' },
      ]}
    >
      <div className="space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Configuración del Individuo</h2>
          <p className="text-muted-foreground">
            Administra la información general, multimedia y sonidos del individuo.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} uuid={uuid} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
