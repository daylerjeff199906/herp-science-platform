"use client"

import * as React from "react"
import Link from 'next/link'
import { Search, ArrowRight } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem } from "@repo/ui/components/ui/carousel"
import { Input } from "@repo/ui/components/ui/input"
import { Button } from "@repo/ui/components/ui/button"
import Autoplay from "embla-carousel-autoplay"

export function HeroSlider() {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )

    const slides = [
        {
            id: 1,
            image: "https://vertebrados.iiap.gob.pe/_next/static/media/rana.d741fb18.webp",
            title: "Colección Científica de Vertebrados",
            subtitle: "Descubre la biodiversidad de la Amazonía Peruana",
        },
        {
            id: 2,
            image: "https://vertebrados.iiap.gob.pe/_next/static/media/iguana.b3c16d1d.webp",
            title: "Investigación y Conservación",
            subtitle: "Comprometidos con el estudio de nuestra fauna silvestre",
        },
        {
            id: 3,
            image: "https://vertebrados.iiap.gob.pe/_next/static/media/reptil.a1cef8f3.webp",
            title: "Anfibios y Reptiles",
            subtitle: "Explora nuestro catálogo taxonómico actualizado",
        },
    ]

    return (
        <div className="relative w-full h-[600px] md:h-[700px] bg-slate-900 overflow-hidden">
            {/* Background Slider */}
            <Carousel
                plugins={[plugin.current]}
                className="w-full h-full"
                opts={{
                    loop: true,
                }}
            >
                <CarouselContent className="h-full ml-0">
                    {slides.map((slide) => (
                        <CarouselItem key={slide.id} className="pl-0 relative w-full h-full">
                            {/* Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
                                style={{ backgroundImage: `url('${slide.image}')` }}
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-transparent" />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {/* Content Container (Overlay) */}
            <div className="absolute inset-0 z-10 flex items-center">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl space-y-6 md:space-y-8 animate-in fade-in slide-in-from-left-10 duration-700">

                        {/* Text Content */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
                                Descubre la <br />
                                <span className="text-emerald-400">Biodiversidad Amazónica</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-200 max-w-xl leading-relaxed">
                                Accede a la colección científica más completa de anfibios y reptiles del IIAP.
                                Información taxonómica y geográfica para la investigación.
                            </p>
                        </div>

                        {/* Search & Actions */}
                        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center max-w-2xl bg-white/5 backdrop-blur-sm p-2 rounded-xl border border-white/10">
                            {/* Search Bar */}
                            <div className="relative flex-grow group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                                <Input
                                    placeholder="Buscar especie (ej. Epipedobates...)"
                                    className="pl-10 h-12 bg-transparent border-transparent text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:bg-slate-800/50 transition-all rounded-lg text-base"
                                />
                            </div>

                            <div className="flex gap-2 shrink-0">
                                {/* Custom Action (Buscar) */}
                                <Button
                                    size="lg"
                                    className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg shadow-emerald-900/20"
                                >
                                    Buscar especie
                                </Button>
                            </div>
                        </div>

                        {/* Secondary Action */}
                        <div>
                            <Button variant="link" className="text-emerald-400 hover:text-emerald-300 p-0 text-base font-medium group">
                                Personalizar búsqueda <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm animate-pulse">
                Scroll to explore
            </div>
        </div>
    )
}
