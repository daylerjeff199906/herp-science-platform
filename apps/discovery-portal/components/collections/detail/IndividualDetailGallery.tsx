'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import Captions from "yet-another-react-lightbox/plugins/captions"
import "yet-another-react-lightbox/plugins/captions.css"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { IndividualDetails } from '@repo/shared-types'
import { CollectionImagePlaceholder } from '../CollectionImagePlaceholder'
import { useTranslations } from 'next-intl'
import { Expand, ImageIcon } from 'lucide-react'

interface IndividualDetailGalleryProps {
    individual: IndividualDetails
}

export function IndividualDetailGallery({ individual }: IndividualDetailGalleryProps) {
    const [index, setIndex] = useState(-1)
    const t = useTranslations('Collections.Detail')
    const tCommon = useTranslations('Common')

    const images = individual.files.images || []

    if (images.length === 0) {
        return (
            <div className="w-full bg-gray-50 rounded-xl overflow-hidden aspect-[4/3] relative border border-gray-200">
                <CollectionImagePlaceholder />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                        {tCommon('noImage')}
                    </span>
                </div>
            </div>
        )
    }

    const slides = images.map(img => ({
        src: img.name,
        alt: individual.species.scientificName,
        title: individual.species.scientificName,
        description: img.note || undefined
    }))

    return (
        <>
            <div className="grid grid-cols-1 gap-4">
                {/* Main Feature Image */}
                <div
                    className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group bg-gray-100 border border-gray-200 shadow-sm"
                    onClick={() => setIndex(0)}
                >
                    <Image
                        src={images[0]?.name || ''}
                        alt={individual.species.scientificName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Overlay with expand icon */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 text-gray-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg">
                            <Expand className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2">
                        <ImageIcon className="w-3 h-3" />
                        {images.length} {t('photos')}
                    </div>
                </div>

                {/* Thumbnails Grid (if more than 1 image) */}
                {images.length > 1 && (
                    <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-2">
                        {images.slice(1, 5).map((img, i) => (
                            <div
                                key={img.id}
                                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-gray-200"
                                onClick={() => setIndex(i + 1)}
                            >
                                <Image
                                    src={img.name}
                                    alt={`Thumbnail ${i + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                {i === 3 && images.length > 5 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium text-sm">
                                        +{images.length - 5}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Lightbox
                open={index >= 0}
                index={index}
                close={() => setIndex(-1)}
                slides={slides}
                plugins={[Captions, Zoom, Thumbnails]}
                captions={{ descriptionTextAlign: 'center' }}
            />
        </>
    )
}
