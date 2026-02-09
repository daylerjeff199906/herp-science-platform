import React from 'react'
import { getTranslations } from 'next-intl/server'
import { GalleryList } from '@/components/collections/GalleryList'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Header.nav' })
    const tCommon = await getTranslations({ locale, namespace: 'Common' })

    return {
        title: `${t('gallery')} | Herp Science Platform`,
        description: tCommon('gallery')
    }
}

export default function GalleryPage() {
    return (
        <GalleryList />
    )
}
