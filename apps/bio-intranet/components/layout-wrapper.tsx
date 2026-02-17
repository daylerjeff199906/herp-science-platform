'use client'

import { SidebarInset } from '@/components/ui/sidebar'
import { SiteHeader } from '@/components/site-header'
import { useTranslations } from 'next-intl'

interface LayoutWrapperProps {
  children: React.ReactNode
  sectionTitle?: string
}

export const LayoutWrapper = ({
  children,
  sectionTitle,
}: LayoutWrapperProps) => {
  const t = useTranslations()

  return (
    <SidebarInset>
      <SiteHeader sectionTitle={sectionTitle} />
      <div className="p-4 md:p-6 flex flex-col gap-4 min-h-[calc(100vh-8rem)]">
        {children}
      </div>
      <footer className="p-4 md:p-6 text-xs text-muted-foreground text-center">
        &copy; {new Date().getFullYear()} IIAP - Bio Intranet.{' '}
        {t('footer.rights') || 'Todos los derechos reservados.'}
      </footer>
    </SidebarInset>
  )
}
