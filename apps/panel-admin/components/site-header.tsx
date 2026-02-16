'use client'

import * as React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface SiteHeaderProps {
  sectionTitle?: string
  breadcrumbs?: { title: string; href?: string }[]
}

export function SiteHeader({ sectionTitle, breadcrumbs }: SiteHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 sticky top-0 z-50">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />

        {breadcrumbs ? (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem className="hidden md:block">
                    {crumb.href ? (
                      <BreadcrumbLink href={crumb.href} className="text-xs">
                        {crumb.title}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="text-xs">
                        {crumb.title}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        ) : sectionTitle ? (
          <span className="text-sm font-medium">{sectionTitle}</span>
        ) : null}
      </div>
    </header>
  )
}
