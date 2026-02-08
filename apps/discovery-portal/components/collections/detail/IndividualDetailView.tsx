'use client'

import React from 'react'
import { IndividualDetails } from '@repo/shared-types'
import { IndividualDetailHeader } from './IndividualDetailHeader'
import { IndividualDetailGallery } from './IndividualDetailGallery'
import { IndividualAudioSection } from './IndividualAudioSection'
import { IndividualDataSections } from './IndividualDataSections'
import { IndividualDetailMap } from './IndividualDetailMap'

interface IndividualDetailViewProps {
    individual: IndividualDetails
}

export function IndividualDetailView({ individual }: IndividualDetailViewProps) {
    return (
        <div className="min-h-screen bg-primary/20 pb-20">
            {/* Header Sticky */}
            <IndividualDetailHeader individual={individual} />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="space-y-8">
                    {/* Gallery */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 px-1">Multimedia</h3>
                        <IndividualDetailGallery individual={individual} />
                    </div>

                    {/* Data Sections */}
                    <IndividualDataSections individual={individual} />

                    {/* Map */}
                    {/* Only show map if coords exist */}
                    {(individual.ocurrence?.event?.latitude && individual.ocurrence?.event?.longitude) && (
                        <IndividualDetailMap individual={individual} />
                    )}

                    {/* Audio */}
                    <IndividualAudioSection individual={individual} />
                </div>
            </div>
        </div>
    )
}
