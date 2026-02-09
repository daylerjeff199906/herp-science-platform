'use client'

import React from 'react'
import { IndividualDetails } from '@repo/shared-types'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'

// Dynamically import Map component to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(
    () => import('./IndividualMapComponent'),
    {
        loading: () => <div className="w-full h-[400px] bg-gray-100 rounded-xl animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div>,
        ssr: false
    }
)

interface IndividualDetailMapProps {
    individual: IndividualDetails
}

export function IndividualDetailMap({ individual }: IndividualDetailMapProps) {
    const t = useTranslations('Collections.Detail')

    // Check if we have coordinates
    const lat = individual.ocurrence?.event?.latitude ? parseFloat(individual.ocurrence.event.latitude) : null
    const lng = individual.ocurrence?.event?.longitude ? parseFloat(individual.ocurrence.event.longitude) : null

    // Check if valid numbers
    const hasCoordinates = lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)

    if (!hasCoordinates) return null

    return (
        <div className="rounded-b-xl">
            <div className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
                <MapWithNoSSR lat={lat!} lng={lng!} popupText={individual.species.scientificName} />
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex justify-end gap-4 px-1">
                <span>Lat: {lat?.toFixed(5)}</span>
                <span>Lng: {lng?.toFixed(5)}</span>
            </div>
        </div>
    )
}
