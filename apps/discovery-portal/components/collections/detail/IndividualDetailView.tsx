'use client'

import React, { useState, useEffect } from 'react'
import { IndividualDetails } from '@repo/shared-types'
import { IndividualDetailHeader } from './IndividualDetailHeader'
import { IndividualDetailGallery } from './IndividualDetailGallery'
import { IndividualAudioSection } from './IndividualAudioSection'
import { IndividualDetailMap } from './IndividualDetailMap'
import { DetailSection } from './DetailSection'
import { DetailRow } from './DetailRow'
import { useTranslations } from 'next-intl'
import { cn } from '@repo/ui'
import {
    Tag,
    Database,
    MapPin,
    Microscope,
    Volume2,
    Image as ImageIcon, // Renamed to avoid conflict if needed
    Info
} from 'lucide-react'

interface IndividualDetailViewProps {
    individual: IndividualDetails
}

export function IndividualDetailView({ individual }: IndividualDetailViewProps) {
    const t = useTranslations('Collections.Detail')
    const tCommon = useTranslations('Common')
    const [activeSection, setActiveSection] = useState<string>('multimedia')

    // Sections configuration for sidebar
    const sections = [
        { id: 'multimedia', label: t('photos'), icon: ImageIcon },
        { id: 'taxonomy', label: t('taxonomy'), icon: Tag },
        { id: 'location', label: t('location'), icon: MapPin }, // Use 'location' key if available or generic
        { id: 'occurrence', label: t('collectionData'), icon: Database }, // mapped to collection data roughly
        { id: 'biology', label: t('biologyAttributes'), icon: Microscope },
        { id: 'audio', label: t('audioRecordings'), icon: Volume2, hidden: !individual.files.audios?.length },
    ].filter(s => !s.hidden)

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            const offset = 100 // Adjust for sticky header
            const bodyRect = document.body.getBoundingClientRect().top
            const elementRect = element.getBoundingClientRect().top
            const elementPosition = elementRect - bodyRect
            const offsetPosition = elementPosition - offset

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            })
            setActiveSection(id)
        }
    }

    // Scroll spy effect
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 120 // Offset

            for (const section of sections) {
                const element = document.getElementById(section.id)
                if (element) {
                    const { offsetTop, offsetHeight } = element
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section.id)
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [sections])

    // Helper to check for coordinates
    const hasCoordinates = individual.ocurrence?.event?.latitude && individual.ocurrence?.event?.longitude

    return (
        <div className="min-h-screen pb-20 bg-background">
            {/* Header Sticky */}
            <IndividualDetailHeader individual={individual} />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">

                    {/* Sidebar Navigation - Visible on LG+ */}
                    <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-1">
                        <div className="rounded-xl border border-border bg-card overflow-hidden py-2">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-4",
                                        activeSection === section.id
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <section.icon className="w-4 h-4" />
                                    {section.label}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-9 space-y-8">

                        {/* Multimedia Section */}
                        <div id="multimedia" className="scroll-mt-24 rounded-xl border border-border bg-card p-4">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                {t('photos')}
                            </h3>
                            <IndividualDetailGallery individual={individual} />
                        </div>

                        {/* Taxonomy Section */}
                        <DetailSection id="taxonomy" title={t('taxonomy')}>
                            <DetailRow label={t('kingdom')} value={individual.species.genus.family.order.class.name} />
                            <DetailRow label={t('class')} value={individual.species.genus.family.order.class.name} />
                            <DetailRow label={t('order')} value={individual.species.genus.family.order.name} />
                            <DetailRow label={t('family')} value={individual.species.genus.family.name} />
                            <DetailRow label={t('genus')} value={individual.species.genus.name} />
                            <DetailRow label={t('scientificName')} value={individual.species.scientificName} />
                            <DetailRow label={t('commonName')} value={individual.species.commonName} />
                        </DetailSection>

                        {/* Location / Event Section (Combined for flow) */}
                        <DetailSection id="location" title={t('location')}>
                            {hasCoordinates && (
                                <IndividualDetailMap individual={individual} />
                            )}
                            <DetailRow label={t('country')} value={individual.ocurrence?.event?.locality?.district?.province?.department?.country?.name} />
                            <DetailRow label={t('department')} value={individual.ocurrence?.event?.locality?.district?.province?.department?.name} />
                            <DetailRow label={t('province')} value={individual.ocurrence?.event?.locality?.district?.province?.name} />
                            <DetailRow label={t('district')} value={individual.ocurrence?.event?.locality?.district?.name} />
                            <DetailRow label={t('locality')} value={individual.ocurrence?.event?.locality?.name} />
                            <DetailRow label={t('latitude')} value={individual.ocurrence?.event?.latitude} />
                            <DetailRow label={t('longitude')} value={individual.ocurrence?.event?.longitude} />
                        </DetailSection>

                        {/* Occurrence / Collection Data */}
                        <DetailSection id="occurrence" title={t('collectionData')}>
                            <DetailRow label={t('catalogNumber')} value={individual.code} />
                            <DetailRow label={t('institutionCode')} value={individual.museum?.acronym} />
                            <DetailRow label={t('collectionCode')} value={individual.museum?.name} />
                            <DetailRow label={t('basisOfRecord')} value="PreservedSpecimen" />
                            <DetailRow label={t('status')} value={individual.status === 1 ? tCommon('active') : tCommon('inactive')} />
                            <DetailRow label={t('date')} value={individual.ocurrence?.event?.date ? new Date(individual.ocurrence.event.date).toLocaleDateString() : null} />
                        </DetailSection>

                        {/* Biology Attributes */}
                        <DetailSection id="biology" title={t('biologyAttributes')}>
                            <DetailRow label={t('sex')} value={individual.sex?.name} />
                            <DetailRow label={t('lifeStage')} value={individual.activity?.name} />
                            <DetailRow label={t('svl')} value={individual.svl ? `${individual.svl} mm` : null} />
                            <DetailRow label={t('weight')} value={individual.weight ? `${individual.weight} g` : null} />
                        </DetailSection>

                        {/* Audio Section */}
                        {individual.files.audios?.length > 0 && (
                            <div id="audio" className="scroll-mt-24">
                                <IndividualAudioSection individual={individual} />
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}
