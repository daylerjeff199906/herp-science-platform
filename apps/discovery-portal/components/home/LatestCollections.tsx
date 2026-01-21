'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useIndividuals } from '@repo/networking'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@repo/ui/components/ui/carousel'
import { Card, CardContent, CardFooter } from '@repo/ui/components/ui/card'
import { Button } from '@repo/ui/components/ui/button'
import { Skeleton } from '@repo/ui/components/ui/skeleton'

export const LatestCollections = () => {
    const { data, isLoading, error } = useIndividuals({
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
                        <div className="h-full border rounded-lg overflow-hidden flex flex-col">
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
                <div className="flex justify-between items-end mb-6">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-24" />
                </div>
                <LoadingSkeleton />
            </section>
        )
    }

    const individuals = data?.data || []

    if (individuals.length === 0) return null

    return (
        <section className="container mx-auto py-12 px-4 bg-[#F0FDF4]">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-semibold text-[#1a4122]">
                    Últimas Colecciones
                </h2>
                <Button variant="default" className="bg-[#4a9335] hover:bg-[#3d7a2c] text-white">
                    <Link href="/collections">Ver todo</Link>
                </Button>
            </div>

            <Carousel
                opts={{
                    align: 'start',
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {individuals.map((individual) => (
                        <CarouselItem
                            key={individual.id}
                            className="pl-4 md:basis-1/2 lg:basis-1/4"
                        >
                            <div className="h-full flex flex-col group cursor-pointer">
                                <div className="relative h-48 w-full overflow-hidden rounded-2xl mb-4">
                                    {individual.files.images && individual.files.images.length > 0 ? (
                                        <Image
                                            src={individual.files.images[0]?.url || '/placeholder.png'}
                                            alt={individual.species.scientificName}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full bg-stone-100 text-stone-400">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col flex-grow">
                                    <span className="text-[#4a9335] text-sm font-semibold mb-2 block">
                                        {individual.createdAt ? format(new Date(individual.createdAt), 'dd MMMM, yyyy', { locale: es }) : 'Fecha desconocida'}
                                    </span>

                                    <h3 className="text-xl font-bold text-[#1a4122] mb-2 font-serif italic leading-tight">
                                        {individual.species.scientificName}
                                    </h3>

                                    <p className="text-stone-600 text-sm mb-3 line-clamp-3">
                                        {individual.species.description || 'Sin descripción disponible.'}
                                    </p>

                                    <div className="mt-auto">
                                        <Link
                                            href={`/collections/${individual.id}`}
                                            className="text-[#1a4122] font-semibold text-sm hover:text-[#4a9335] transition-colors inline-block"
                                        >
                                            Leer más...
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="hidden md:block">
                    <CarouselPrevious className="-left-4 border-[#4a9335] text-[#4a9335] hover:bg-[#4a9335] hover:text-white" />
                    <CarouselNext className="-right-4 border-[#4a9335] text-[#4a9335] hover:bg-[#4a9335] hover:text-white" />
                </div>
            </Carousel>
        </section>
    )
}
