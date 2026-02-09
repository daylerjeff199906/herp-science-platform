'use client'

import React from 'react'
import { IndividualDetails } from '@repo/shared-types'
import { useTranslations } from 'next-intl'
import {
    Info,
    Calendar,
    MapPin,
    User,
    Tag,
    Database,
    Microscope
} from 'lucide-react'

interface IndividualDataSectionsProps {
    individual: IndividualDetails
}

const DetailRow = ({ label, value, isLink = false }: { label: string, value: React.ReactNode, isLink?: boolean }) => {
    if (value === null || value === undefined || value === '') return null
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-4 -mx-4 dark:border-gray-800 dark:hover:bg-gray-800">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 md:col-span-1">{label}</dt>
            <dd className="text-sm md:col-span-2 font-medium break-words">
                {value}
            </dd>
        </div>
    )
}

const SectionCard = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
        <div className="p-6">
            <dl className="space-y-1">
                {children}
            </dl>
        </div>
    </div>
)

export function IndividualDataSections({ individual }: IndividualDataSectionsProps) {
    const t = useTranslations('Collections.Detail')
    const tCommon = useTranslations('Common')

    return (
        <div className="space-y-6">
            {/* Taxonomy Section */}
            <SectionCard title={t('taxonomy')} icon={Tag}>
                <DetailRow label={t('kingdom')} value={individual.species.genus.family.order.class.name} /> {/* Assuming higher taxonomy isn't fully in type yet or mapped differently, using class as placeholder for now if kingdom missing */}
                <DetailRow label={t('class')} value={individual.species.genus.family.order.class.name} />
                <DetailRow label={t('order')} value={individual.species.genus.family.order.name} />
                <DetailRow label={t('family')} value={individual.species.genus.family.name} />
                <DetailRow label={t('genus')} value={individual.species.genus.name} />
                <DetailRow label={t('scientificName')} value={individual.species.scientificName} />
                <DetailRow label={t('commonName')} value={individual.species.commonName} />
            </SectionCard>

            {/* Collection Data */}
            <SectionCard title={t('collectionData')} icon={Database}>
                <DetailRow label={t('catalogNumber')} value={individual.code} />
                <DetailRow label={t('institutionCode')} value={individual.museum?.acronym} />
                <DetailRow label={t('collectionCode')} value={individual.museum?.name} />
                {/* Add more specific fields if available in API response */}
                <DetailRow label={t('basisOfRecord')} value="PreservedSpecimen" />
                <DetailRow label={t('status')} value={individual.status === 1 ? tCommon('active') : tCommon('inactive')} />
            </SectionCard>

            {/* Event & Location */}
            <SectionCard title={t('eventLocation')} icon={MapPin}>
                <DetailRow label={t('country')} value={individual.ocurrence?.event?.locality?.district?.province?.department?.country?.name} />
                <DetailRow label={t('department')} value={individual.ocurrence?.event?.locality?.district?.province?.department?.name} />
                <DetailRow label={t('province')} value={individual.ocurrence?.event?.locality?.district?.province?.name} />
                <DetailRow label={t('district')} value={individual.ocurrence?.event?.locality?.district?.name} />
                <DetailRow label={t('locality')} value={individual.ocurrence?.event?.locality?.name} />
                <DetailRow label={t('date')} value={individual.ocurrence?.event?.date ? new Date(individual.ocurrence.event.date).toLocaleDateString() : null} />
                <DetailRow label={t('latitude')} value={individual.ocurrence?.event?.latitude} />
                <DetailRow label={t('longitude')} value={individual.ocurrence?.event?.longitude} />
            </SectionCard>

            {/* Biology / Attributes */}
            <SectionCard title={t('biologyAttributes')} icon={Microscope}>
                <DetailRow label={t('sex')} value={individual.sex?.name} />
                <DetailRow label={t('lifeStage')} value={individual.activity?.name} /> {/* Mapping activity to stage/behavior ? or mostly generic */}
                <DetailRow label={t('preparations')} value={null} /> {/* If field exists */}
                <DetailRow label={t('svl')} value={individual.svl ? `${individual.svl} mm` : null} />
                <DetailRow label={t('weight')} value={individual.weight ? `${individual.weight} g` : null} />
            </SectionCard>
        </div>
    )
}
