import { LayoutWrapper } from '@/components/layout-wrapper'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutWrapper
      sectionTitle="Gestión de Países"
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Ubicación', href: '#' },
        { title: 'Países' },
      ]}
    >
      {children}
    </LayoutWrapper>
  )
}
