'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
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

export const LatestCollections = () => {
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
                            Últimas Colecciones
                        </h2>
                    </div>

                    <Button
                        asChild
                        className="rounded-full bg-slate-800 hover:bg-slate-700 text-white px-8 py-6 text-sm font-medium"
                    >
                        <Link href="/collections" className="flex items-center gap-2">
                            Ver todo
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
        <section className="bg-white">
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
                            <h2 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight">
                                Últimas Colecciones
                            </h2>
                            <div className="hidden md:flex gap-2">
                                <CarouselPrevious className="static translate-y-0 h-12 w-12 border-slate-300 text-slate-600 hover:bg-transparent hover:text-slate-900 hover:border-slate-900 transition-colors" />
                                <CarouselNext className="static translate-y-0 h-12 w-12 border-slate-300 text-slate-600 hover:bg-transparent hover:text-slate-900 hover:border-slate-900 transition-colors" />
                            </div>
                        </div>

                        <Button
                            asChild
                            className="rounded-full bg-slate-800 hover:bg-slate-700 text-white px-8 py-6 text-sm font-medium"
                        >
                            <Link href="/collections" className="flex items-center gap-2">
                                Ver todo
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
                                <div className="h-full flex flex-col group cursor-pointer">
                                    {/* Image Card */}
                                    <div className="relative h-64 w-full overflow-hidden rounded-xl mb-6 bg-slate-100">
                                        <Link href={`/collections/${individual.id}`}>
                                            {individual.files.images &&
                                                individual.files.images.length > 0 ? (
                                                <Image
                                                    src={
                                                        individual.files.images[0]?.name ||
                                                        '/placeholder.png'
                                                    }
                                                    alt={individual.species.scientificName}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-400">
                                                    <span className="text-sm">Sin imagen</span>
                                                </div>
                                            )}
                                        </Link>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col flex-grow">
                                        <Link href={`/collections/${individual.id}`}>
                                            <h3 className="text-xl font-medium text-slate-900 mb-3 leading-snug group-hover:text-slate-600 transition-colors">
                                                {individual.species.scientificName}
                                                <span className="block text-slate-500 text-lg font-normal mt-1">
                                                    {individual.species.commonName}
                                                </span>
                                            </h3>
                                        </Link>

                                        <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                                            {individual.species.description ||
                                                'No hay descripción disponible para esta especie.'}
                                        </p>

                                        <div className="mt-auto">
                                            <Link
                                                href={`/collections/${individual.id}`}
                                                className="flex items-center gap-3 group/link"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 transition-colors duration-300 group-hover:bg-slate-900 group-hover:border-slate-900">
                                                    <ArrowRight className="h-4 w-4 text-stone-600 transition-colors duration-300 group-hover:text-white" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-900 transition-all duration-300 group-hover:font-bold">
                                                    Leer más
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    )
}
