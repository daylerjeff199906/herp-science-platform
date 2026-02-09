import React from 'react'
import { getTranslations } from 'next-intl/server'
import { GalleryList } from '@/components/collections/GalleryList'
import { Metadata } from 'next'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Header.nav' })
    const tCommon = await getTranslations({ locale, namespace: 'Common' })

    return {
        title: `${t('gallery')} | Herp Science Platform`,
        description: tCommon('gallery') // Or a more specific description if available
    }
}

export default function GalleryPage() {
    return (
        <div className="px-4 min-h-screen">
            <div
                className='h-24 bg-dark-900'
            />
            <GalleryList />
        </div>
    )
}
