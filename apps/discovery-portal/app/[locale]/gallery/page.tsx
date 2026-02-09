'use client'

import React, { useState } from 'react'
import { useInfiniteIndividuals } from '@repo/networking/hooks/useIndividuals'
import { GalleryIndividualCard } from '@/components/collections/GalleryIndividualCard'
import { CollectionImagePlaceholder } from '@/components/collections/CollectionImagePlaceholder'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import { Button } from '@repo/ui'
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import Captions from "yet-another-react-lightbox/plugins/captions"
import "yet-another-react-lightbox/plugins/captions.css"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export default function GalleryPage() {
    const t = useTranslations('Collections.Gallery')
    const tCommon = useTranslations('Common')
    const [lightboxIndex, setLightboxIndex] = useState(-1)

    // Fetch individuals with infinite scrolling
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useInfiniteIndividuals({
        pageSize: 20, // Initial load
        hasImages: 1
    })

    const individuals = data?.pages.flatMap(page => page.data) || []

    const slides = individuals.map(ind => ({
        src: ind.files.images?.[0]?.name || '/images/placeholder.jpg', // Fallback or handle empty
        alt: ind.species.scientificName,
        title: ind.species.scientificName,
        description: ind.species.commonName || undefined,
    }))

    // Handlers
    const handleCardClick = (index: number) => {
        setLightboxIndex(index)
    }

    return (
        <div className="px-4 py-8 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center">{tCommon('gallery')}</h1>

            {status === 'pending' ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : status === 'error' ? (
                <div className="text-center text-red-500 py-20">
                    {tCommon('errorLoadingData')}
                </div>
            ) : (
                <>
                    {/* Masonry Layout using CSS Columns */}
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                        {individuals.map((individual, index) => (
                            <div key={`${individual.id}-${index}`} className="break-inside-avoid">
                                <GalleryIndividualCard
                                    individual={individual}
                                    onClick={() => handleCardClick(index)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Load More / Infinite Scroll Trigger */}
                    <div className="mt-8 flex justify-center pb-8">
                        {hasNextPage ? (
                            <Button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                variant="outline"
                                size="lg"
                                className="min-w-[200px] rounded-full"
                            >
                                {isFetchingNextPage ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {tCommon('loading')}...
                                    </>
                                ) : (
                                    tCommon('loadMore')
                                )}
                            </Button>
                        ) : (
                            <p className="text-gray-500 italic">
                                {individuals.length > 0 ? tCommon('allLoaded') : tCommon('noResults')}
                            </p>
                        )}
                    </div>

                    {/* Lightbox Viewer */}
                    <Lightbox
                        open={lightboxIndex >= 0}
                        index={lightboxIndex}
                        close={() => setLightboxIndex(-1)}
                        slides={slides}
                        plugins={[Captions, Zoom, Thumbnails]}
                        captions={{ descriptionTextAlign: 'center' }}
                    />
                </>
            )}
        </div>
    )
}
