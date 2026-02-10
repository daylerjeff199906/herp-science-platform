'use client'

import React from 'react'
import { Link } from '@/i18n/routing'
import { ROUTES } from '@/config/routes'
import { IndividualDetails } from '@repo/shared-types'
import { ArrowLeft, Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CitationGenerator } from './CitationGenerator'

interface IndividualDetailHeaderProps {
    individual: IndividualDetails
}

export function IndividualDetailHeader({ individual }: IndividualDetailHeaderProps) {
    const t = useTranslations('Collections.Detail')
    const tCommon = useTranslations('Common')

    const scientificName = individual.species.scientificName
    const commonName = individual.species.commonName || tCommon('noCommonName')

    // Construct taxonomy breadcrumb if possible, or just list main groups
    const taxonomy = [
        individual.species.genus?.family?.order?.class?.name,
        individual.species.genus?.family?.order?.name,
        individual.species.genus?.family?.name,
        individual.species.genus?.name,
        individual.species.scientificName,
    ].filter(Boolean).join(' > ')

    return (
        <div className="border-b">
            <div className="container mx-auto px-4 py-8">
                {/* Top Navigation Bar */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href={ROUTES.COLLECTIONS}
                        className="flex items-center text-sm font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('backToCollections')}
                    </Link>

                    <div className="flex items-center gap-2">
                        <CitationGenerator individual={individual} />
                        <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors" title={t('share')}>
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Centered Title Section */}
                <div className="flex flex-col items-center text-center space-y-4 max-w-4xl mx-auto">
                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
                        <span>{t('record')}</span>
                        <span className="w-px h-3 bg-gray-300"></span>
                        <span>{new Date(individual.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
                    </div>

                    {/* Scientific Name */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif italic leading-tight">
                        {scientificName}
                    </h1>

                    {/* Common Name / Subtitle */}
                    {commonName && (
                        <div className="flex flex-wrap items-center justify-center gap-2 text-lg text-gray-600">
                            <span className="font-semibold">{t('commonName')}:</span>
                            <span className="text-primary text-xl">{commonName}</span>
                        </div>
                    )}

                    {/* Taxonomy Trail */}
                    <div className="pt-4 mt-2">
                        <div className="inline-flex flex-wrap items-center justify-center gap-x-2 text-sm text-gray-500">
                            {taxonomy.split(' > ').map((item, index, array) => (
                                <React.Fragment key={index}>
                                    <span className="hover:text-primary transition-colors cursor-default">{item}</span>
                                    {index < array.length - 1 && <span className="text-gray-300">›</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
