"use client"
import * as React from "react"
import { Search, ArrowRight } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem } from "@repo/ui/components/ui/carousel"
import { Input } from "@repo/ui/components/ui/input"
import { Button } from "@repo/ui/components/ui/button"
import Autoplay from "embla-carousel-autoplay"

export function HeroSlider() {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: false }) // Changed stopOnInteraction to false
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
        <div className="relative w-full h-screen min-[1920px]:h-[920px] bg-emerald-950 overflow-hidden"> {/* Changed height to h-screen and added min-[1920px]:h-[800px] */}
            {/* Background Slider */}
            <Carousel
                plugins={[plugin.current]}
                className="w-full h-full"
                opts={{
                    loop: true,
                    align: "start", // Added align: "start"
                }}
            >
                <CarouselContent className="h-full ml-0">
                    {slides.map((slide) => (
                        <CarouselItem key={slide.id} className="pl-0 relative w-full h-full">
                            {/* Image */}
                            <div className="relative w-full h-full"> {/* Wrapper div for Next/Image */}
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="object-cover transition-transform duration-1000 select-none w-full h-screen md:h-full"
                                />
                            </div>
                            {/* Overlay Gradient - Amazonian Green */}
                            <div className="absolute inset-0 bg-black/40" />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {/* Content Container (Overlay) */}
            <div className="absolute inset-0 z-10 flex items-center">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl space-y-8 md:space-y-10 animate-in fade-in slide-in-from-left-10 duration-700">

                        {/* Text Content */}
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-none drop-shadow-md">
                                Descubre la <br />
                                <span className="text-[#ADDE60]">Biodiversidad Amazónica</span>
                            </h1>
                            <p className="text-lg md:text-xl text-emerald-100/90 max-w-2xl leading-relaxed font-light">
                                Accede a la colección científica más completa de anfibios y reptiles del IIAP.
                                Información taxonómica y geográfica para la investigación.
                            </p>
                        </div>

                        {/* Search & Actions Container */}
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full">
                            {/* Search Bar - Style match: Outline white, pill shape, icon right */}
                            <div className="relative w-full max-w-md group">
                                <Input
                                    placeholder="Buscar especie..."
                                    className="w-full h-14 pl-6 pr-12 bg-transparent border-[1.5px] border-[#ADDE60]/30 hover:border-[#ADDE60] text-white placeholder:text-white/60 focus-visible:ring-1 focus-visible:ring-[#ADDE60] focus-visible:border-[#ADDE60] transition-all rounded-full text-lg"
                                />
                                <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#ADDE60]/80 group-hover:text-[#ADDE60] transition-colors" />
                            </div>

                            {/* Custom Action Button - Style match: Solid Green background, dark text */}
                            <Button
                                size="lg"
                                className="h-14 pl-2 pr-6 bg-[#ADDE60] hover:bg-[#9cc954] text-emerald-950 font-bold text-lg rounded-full transition-all group shadow-[0_0_20px_rgba(173,222,96,0.3)] hover:shadow-[0_0_30px_rgba(173,222,96,0.5)]"
                            >
                                <div className="bg-emerald-950 rounded-full p-2 mr-3 group-hover:scale-110 transition-transform">
                                    <ArrowRight className="w-4 h-4 text-[#ADDE60]" />
                                </div>
                                Personalizar búsqueda
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#ADDE60]/60 text-sm animate-pulse flex flex-col items-center gap-2">
                <span className="uppercase tracking-widest text-xs font-medium">Explorar</span>
                <div className="w-[1px] h-8 bg-gradient-to-b from-[#ADDE60]/60 to-transparent" />
            </div>
        </div>
    )
}
