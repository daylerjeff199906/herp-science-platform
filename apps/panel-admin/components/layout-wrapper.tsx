import { ReactNode } from 'react'
import { SidebarInset } from '@/components/ui/sidebar'
import { SiteHeader } from './site-header'

interface LayoutWrapperProps {
  children: ReactNode
  sectionTitle?: string
  breadcrumbs?: { title: string; href?: string }[]
  showFooter?: boolean
}

export function LayoutWrapper({
  children,
  sectionTitle,
  breadcrumbs,
  showFooter = true,
}: LayoutWrapperProps) {
  return (
    <SidebarInset>
      <SiteHeader sectionTitle={sectionTitle} breadcrumbs={breadcrumbs} />
      <div className="p-4 md:p-6 flex flex-col gap-4 min-h-[calc(100vh-8rem)]">
        {children}
      </div>
      {showFooter && (
        <footer className="p-4 md:p-6 text-xs text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} HERP Platform. Todos los derechos
          reservados.
        </footer>
      )}
    </SidebarInset>
  )
}
