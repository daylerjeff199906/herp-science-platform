'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { LayoutWrapper } from '@/components/layout-wrapper'

export default function DashboardPage() {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const isNewUser = searchParams.get('welcome') === 'true'

  useEffect(() => {
    if (isNewUser) {
      // Could trigger a toast here
      // alert("Welcome to B.E.A IIAP! Your profile is set up.")
    }
  }, [isNewUser])

  return (
    <LayoutWrapper sectionTitle={t('Dashboard.title')}>
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-4xl font-bold mb-4">{t('Dashboard.title')}</h1>
        {isNewUser && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md border border-green-200 max-w-lg text-center">
            {t('Dashboard.welcomeMessage')}
          </div>
        )}
        <p className="mt-4 text-center max-w-lg text-muted-foreground">
          {t('Dashboard.protectedArea')}
        </p>
      </div>
    </LayoutWrapper>
  )
}
