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
    <SidebarInset className="max-h-svh overflow-hidden">
      <SiteHeader sectionTitle={sectionTitle} />
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {children}
        <footer className="p-4 md:p-6 text-xs text-muted-foreground text-center mt-auto">
          &copy; {new Date().getFullYear()} IIAP - Bio Intranet.{' '}
          {t('footer.rights') || 'Todos los derechos reservados.'}
        </footer>
      </div>
    </SidebarInset>
  )
}
