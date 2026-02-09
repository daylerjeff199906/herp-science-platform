'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useInfiniteIndividuals } from '@repo/networking/hooks/useIndividuals'
import { GalleryIndividualCard } from '@/components/collections/GalleryIndividualCard'
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
import { Individual } from '@repo/shared-types'
import { fetchIndividualByUuid } from '@repo/networking/services/individuals'
import { useQuery } from '@tanstack/react-query'

export function GalleryList() {
    const t = useTranslations('Collections.Gallery')
    const tCommon = useTranslations('Common')
    const [selectedUuid, setSelectedUuid] = useState<string | null>(null)
    const [lightboxOpen, setLightboxOpen] = useState(false)

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

    const individuals = useMemo(() => data?.pages.flatMap(page => page.data) || [], [data])

    // Fetch full details when an individual is selected (for high-res/all images)
    const { data: fullIndividual, isFetching: isFetchingDetail } = useQuery({
        queryKey: ['individual', selectedUuid],
        queryFn: () => selectedUuid ? fetchIndividualByUuid(selectedUuid) : null,
        enabled: !!selectedUuid && lightboxOpen,
        staleTime: 1000 * 60 * 5 // Cache for 5 mins
    })


    const slides = useMemo(() => {
        if (!fullIndividual && !selectedUuid) return []

        // If we have full details, use its images
        if (fullIndividual?.files?.images) {
            return fullIndividual.files.images.map(img => ({
                src: img.name, // Assuming name is the full URL or we prepend domain if needed. In CollectionCard it acts as URL.
                alt: fullIndividual.species.scientificName,
                title: fullIndividual.species.scientificName,
                description: img.note || fullIndividual.species.commonName || undefined
            }))
        }

        const listInd = individuals.find(i => i.code === selectedUuid || i.id.toString() === selectedUuid || (selectedUuid && i.id === parseInt(selectedUuid))) // id vs uuid mixup potential, let's assume uuid is passed but id is number in types?

        if (listInd?.files?.images?.[0]) {
            return [{
                src: listInd.files.images[0].name,
                alt: listInd.species.scientificName,
                title: listInd.species.scientificName,
                description: listInd.species.commonName || undefined
            }]
        }

        return []
    }, [fullIndividual, individuals, selectedUuid])


    // Handlers
    const handleCardClick = (individual: Individual) => {
        setSelectedUuid(individual.id.toString())
        setLightboxOpen(true)
    }

    // We can do a simple distribution into N arrays.
    const [columnsCount, setColumnsCount] = useState(1)

    useEffect(() => {
        const updateColumns = () => {
            if (window.innerWidth >= 1024) setColumnsCount(4)
            else if (window.innerWidth >= 768) setColumnsCount(3)
            else setColumnsCount(2)
        }

        updateColumns()
        window.addEventListener('resize', updateColumns)
        return () => window.removeEventListener('resize', updateColumns)
    }, [])

    const columns = useMemo(() => {
        const cols: Individual[][] = Array.from({ length: columnsCount }, () => [])
        individuals.forEach((item, index) => {
            cols[index % columnsCount]?.push(item)
        })
        return cols
    }, [individuals, columnsCount])


    return (
        <div className="min-h-screen bg-gray-950">
            <div
                className='h-24 bg-dark-900'
            />
            {status === 'pending' ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : status === 'error' ? (
                <div className="text-center text-red-500 py-20 min-h-screen flex items-center justify-center">
                    {tCommon('errorLoadingData')}
                </div>
            ) : (
                <>
                    {/* JS Masonry Layout */}
                    <div className="flex gap-4 items-start">
                        {columns.map((col, colIndex) => (
                            <div key={colIndex} className="flex-1 space-y-4">
                                {col.map((individual) => (
                                    <GalleryIndividualCard
                                        key={individual.id}
                                        individual={individual}
                                        onClick={() => handleCardClick(individual)}
                                    />
                                ))}
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
                        open={lightboxOpen}
                        close={() => setLightboxOpen(false)}
                        slides={slides}
                        plugins={[Captions, Zoom, Thumbnails]}
                        captions={{ descriptionTextAlign: 'center' }}
                        // Show loading indicator if detail is fetching
                        render={{
                            iconLoading: () => isFetchingDetail ? <Loader2 className="w-8 h-8 animate-spin text-white" /> : null
                        }}
                    />
                </>
            )}
        </div>
    )
}
