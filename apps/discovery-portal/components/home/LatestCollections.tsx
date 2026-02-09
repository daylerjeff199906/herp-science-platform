'use client'

import React from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { ROUTES } from '@/config/routes'
import { useTranslations } from 'next-intl'
import { useIndividuals } from '@repo/networking'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@repo/ui/components/ui/carousel'
import { Button } from '@repo/ui/components/ui/button'
import { Skeleton } from '@repo/ui/components/ui/skeleton'
import { ArrowRight } from 'lucide-react'
import { CollectionImagePlaceholder } from '@/components/collections/CollectionImagePlaceholder'
import { CollectionCard } from '../collections/CollectionCard'

export const LatestCollections = () => {
    const tCommon = useTranslations('Common')
    const tCollections = useTranslations('Collections')

    const { data, isLoading } = useIndividuals({
        page: 1,
        pageSize: 8,
        orderBy: 'commonName',
        orderType: 'ASC',
    })

    // Skeleton Loading Component
    const LoadingSkeleton = () => (
        <Carousel
            opts={{
                align: 'start',
            }}
            className="w-full"
        >
            <CarouselContent>
                {Array.from({ length: 4 }).map((_, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                        <div className="h-full  rounded-lg overflow-hidden flex flex-col bg-gray-100 animate-pulse">
                            <Skeleton className="h-48 w-full" />
                            <div className="p-4 space-y-3 flex-grow">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                            <div className="p-4 pt-0">
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )

    if (isLoading) {
        return (
            <section className="container mx-auto py-12 px-4 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div className="flex items-center gap-6">
                        <h2 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight">
                            {tCollections('latestTitle')}
                        </h2>
                    </div>

                    <Button
                        asChild
                        className="rounded-full bg-slate-800 hover:bg-slate-700 text-white px-8 py-6 text-sm font-medium dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"
                    >
                        <Link href={ROUTES.COLLECTIONS} className="flex items-center gap-2">
                            {tCommon('viewAll')}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <LoadingSkeleton />
            </section>
        )
    }

    const individuals = data?.data || []

    if (individuals.length === 0) return null

    return (
        <section className="">
            <div className="container mx-auto py-16 px-4">
                {/* Header with Title and Custom Navigation */}
                <Carousel
                    opts={{
                        align: 'start',
                    }}
                    className="w-full"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                        <div className="flex items-center gap-6">
                            <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
                                {tCollections('latestTitle')}
                            </h2>
                            <div className="hidden md:flex gap-2">
                                <CarouselPrevious className="static translate-y-0 h-12 w-12 border-slate-300 text-slate-600 hover:bg-transparent hover:text-slate-900 hover:border-slate-900 dark:hover:text-white dark:hover:border-white transition-colors" />
                                <CarouselNext className="static translate-y-0 h-12 w-12 border-slate-300 text-slate-600 hover:bg-transparent hover:text-slate-900 hover:border-slate-900 dark:hover:text-white dark:hover:border-white transition-colors" />
                            </div>
                        </div>

                        <Button
                            asChild
                            className="rounded-full bg-slate-800 hover:bg-slate-700 text-white px-8 py-6 text-sm font-medium"
                        >
                            <Link href={ROUTES.COLLECTIONS} className="flex items-center gap-2">
                                {tCommon('viewAll')}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <CarouselContent className="-ml-6">
                        {individuals.map((individual) => (
                            <CarouselItem
                                key={individual.id}
                                className="pl-6 md:basis-1/2 lg:basis-1/4"
                            >
                                <CollectionCard
                                    item={individual}
                                    view="grid"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    )
}
