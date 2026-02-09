import React from 'react'
import Image from 'next/image'
import { Individual } from '@repo/shared-types'
import { CollectionImagePlaceholder } from './CollectionImagePlaceholder'
import { cn } from '@repo/ui'
import { useTranslations } from 'next-intl'
import { Expand } from 'lucide-react'

interface GalleryIndividualCardProps {
    individual: Individual
    onClick: () => void
}

export function GalleryIndividualCard({ individual, onClick }: GalleryIndividualCardProps) {
    const tCommon = useTranslations('Common')

    // Determine image source
    const imageUrl = individual.files.images?.[0]?.name
    const scientificName = individual.species.scientificName
    const commonName = individual.species.commonName || tCommon('noCommonName')

    return (
        <div
            className="group relative mb-4 break-inside-avoid rounded-xl overflow-hidden cursor-pointer bg-gray-950 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in zoom-in-95 duration-700 slide-in-from-bottom-8"
            onClick={onClick}
        >
            {/* Image */}
            <div className="relative w-full">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={scientificName}
                        width={500}
                        height={500}
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                ) : (
                    <div className="aspect-[4/5] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <div className="opacity-50 scale-75">
                            <CollectionImagePlaceholder />
                        </div>
                    </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Zoom Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full text-white">
                        <Expand className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Content (Visible on hover or always visible in a clean way) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <h3 className="text-white font-bold text-sm md:text-base leading-tight italic">
                    {scientificName}
                </h3>
                {commonName && (
                    <p className="text-gray-300 text-xs mt-1 truncate">
                        {commonName}
                    </p>
                )}
            </div>
        </div>
    )
}
