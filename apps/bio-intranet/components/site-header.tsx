'use client'

import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useTranslations } from 'next-intl'

interface SiteHeaderProps {
  sectionTitle?: string
}

export function SiteHeader({ sectionTitle }: SiteHeaderProps) {
  const t = useTranslations()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold">
            {sectionTitle || t('Dashboard.title')}
          </h1>
        </div>
      </div>
    </header>
  )
}
