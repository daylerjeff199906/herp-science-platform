"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@repo/ui"
import { cn } from "@/lib/utils"

export interface HeroSlide {
    id: string
    title: string
    description?: string
    imageUrl?: string
    href?: string
    ctaLabel?: string
}

interface HeroSliderProps {
    slides?: HeroSlide[]
}

export function HeroSlider({ slides = [] }: HeroSliderProps) {
    const defaultSlide: HeroSlide = {
        id: "default-welcome",
        title: "Bienvenido a la Intranet de Investigaciones",
        description: "Accede a diferentes herramientas y recursos para tu investigación científica.",
        imageUrl: "/images/hero-fallback.webp",
        href: "/dashboard",
        ctaLabel: "Explorar",
    }

    const items = slides.length > 0 ? slides : [defaultSlide]

    return (
        <div className="w-full py-6">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {items.map((slide) => (
                        <CarouselItem key={slide.id} className="md:basis-1/1 lg:basis-1/1">
                            <div className="p-1">
                                <Link
                                    href={slide.href || "#"}
                                    className={cn(
                                        "block group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                        !slide.href && "pointer-events-none"
                                    )}
                                >
                                    <Card className="border-0 shadow-none overflow-hidden aspect-[21/9] md:aspect-[2.5/1] relative">
                                        {/* Background Image */}
                                        {slide.imageUrl ? (
                                            <div className="absolute inset-0 w-full h-full">
                                                {/* Placeholder for real image implementation using Next.js Image or a div with bg */}
                                                <div className="relative w-full h-full bg-muted">
                                                    {/* Assuming imageUrl is a valid path. If not, fallback or update later */}
                                                    {/* Since I don't have the image file yet, I'll use a placeholder colored div if it fails or just a div */}
                                                    {/* Dark overlay */}
                                                    <div className="absolute inset-0 bg-black/40 z-10" />
                                                    <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent z-10" />
                                                    {/* In a real app we'd use <Image src={slide.imageUrl} ... /> */}
                                                    <div
                                                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                                        style={{ backgroundImage: `url(${slide.imageUrl})`, backgroundColor: '#333' }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
                                        )}

                                        <CardContent className="relative z-20 flex flex-col justify-end h-full p-6 md:p-10 lg:px-16 max-w-2xl">
                                            <h2 className="text-3xl md:text-4xl tracking-tight mb-4 text-foreground">
                                                {slide.title}
                                            </h2>
                                            {slide.description && (
                                                <p className="text-sm md:text-base mb-8 max-w-lg line-clamp-3">
                                                    {slide.description}
                                                </p>
                                            )}

                                            {slide.href && (
                                                <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                                                    {slide.ctaLabel || "Ver más"}
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {items.length > 1 && (
                    <>
                        <CarouselPrevious className="left-4 hidden md:flex" />
                        <CarouselNext className="right-4 hidden md:flex" />
                    </>
                )}
            </Carousel>
        </div>
    )
}
