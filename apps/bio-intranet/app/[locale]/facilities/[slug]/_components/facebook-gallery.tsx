"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface FacebookGalleryProps {
    images: string[]
}

export function FacebookGallery({ images = [] }: FacebookGalleryProps) {
    const [index, setIndex] = useState<number | null>(null)

    if (!images || images.length === 0) return null

    const limit = 5
    const displayImages = images.slice(0, limit)
    const remainingCount = images.length - limit

    const openLightbox = (i: number) => setIndex(i)
    const closeLightbox = () => setIndex(null)
    const next = () => setIndex((prev) => (prev === null ? null : (prev + 1) % images.length))
    const prev = () => setIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length))

    return (
        <div className="space-y-4">
            {/* Grid Layout Logic */}
            <div className={`grid gap-2 overflow-hidden rounded-3xl h-[500px] border ${
                images.length === 1 ? "grid-cols-1" : 
                images.length === 2 ? "grid-cols-2" : 
                "grid-cols-12"
            }`}>
                
                {/* 1 Image */}
                {images.length === 1 && (
                    <div className="relative h-full w-full cursor-pointer overflow-hidden" onClick={() => openLightbox(0)}>
                        <img src={images[0]} className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" alt="Gallery" />
                    </div>
                )}

                {/* 2 Images */}
                {images.length === 2 && images.map((img, i) => (
                    <div key={i} className="relative h-full w-full cursor-pointer overflow-hidden" onClick={() => openLightbox(i)}>
                        <img src={img} className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" alt="Gallery" />
                    </div>
                ))}

                {/* 3 or more Images */}
                {images.length >= 3 && (
                    <>
                        <div className="col-span-12 md:col-span-8 h-full relative cursor-pointer overflow-hidden" onClick={() => openLightbox(0)}>
                            <img src={images[0]} className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" alt="Gallery" />
                        </div>
                        <div className="col-span-12 md:col-span-4 grid grid-rows-2 md:grid-rows-none grid-cols-2 md:grid-cols-1 gap-2 h-full">
                            {images.slice(1, images.length === 3 ? 3 : images.length === 4 ? 4 : 5).map((img, i) => {
                                const isLast = i === displayImages.length - 2 && remainingCount > 0
                                return (
                                    <div key={i} className="relative h-full w-full cursor-pointer overflow-hidden" onClick={() => openLightbox(i + 1)}>
                                        <img src={img} className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" alt="Gallery" />
                                        {isLast && (
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                                                <span className="text-white text-3xl font-bold">+{remainingCount}</span>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Lightbox / Facebook Style View */}
            <AnimatePresence>
                {index !== null && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex flex-col md:flex-row"
                    >
                        {/* Main Image View */}
                        <div className="flex-1 relative flex items-center justify-center p-4 md:p-12">
                            <button onClick={closeLightbox} className="absolute top-6 left-6 text-white/70 hover:text-white transition-colors z-[110] bg-white/10 p-2 rounded-full">
                                <X className="h-6 w-6" />
                            </button>

                            <motion.img 
                                key={index}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                src={images[index]} 
                                className="max-h-full max-w-full object-contain rounded-lg shadow-none" 
                                alt="Lightbox" 
                            />

                            <div className="absolute inset-y-0 left-4 flex items-center">
                                <button onClick={prev} className="bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-all backdrop-blur-sm">
                                    <ChevronLeft className="h-8 w-8" />
                                </button>
                            </div>
                            <div className="absolute inset-y-0 right-4 flex items-center">
                                <button onClick={next} className="bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-all backdrop-blur-sm">
                                    <ChevronRight className="h-8 w-8" />
                                </button>
                            </div>

                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white/60 text-xs font-bold font-mono">
                                {index + 1} / {images.length}
                            </div>
                        </div>

                        {/* Sidebar View */}
                        <div className="w-full md:w-[400px] bg-background md:border-l border-white/10 p-8 space-y-8 overflow-y-auto">
                             <div className="flex items-center gap-4">
                                <div className="h-10 w-10 flex items-center justify-center grayscale brightness-0 invert dark:invert-0">
                                    <img 
                                        src="/brands/logo-iiap.webp" 
                                        alt="IIAP Logo" 
                                        className="h-full w-auto object-contain"
                                    />
                                </div>
                                <div>
                                    <p className="font-bold tracking-tight text-foreground uppercase text-sm">IIAP Oficial</p>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Galería de Instalaciones</p>
                                </div>
                             </div>

                             <div className="space-y-4">
                                 <h3 className="text-xl font-bold tracking-tighter leading-none text-foreground uppercase">Visualiza nuestras sedes</h3>
                                 <p className="text-sm text-muted-foreground leading-relaxed">
                                     Capturas de alta resolución de la infraestructura científica y cultural del Instituto de Investigaciones de la Amazonía Peruana.
                                 </p>
                             </div>

                             <div className="pt-8 border-t border-muted grid grid-cols-3 gap-2">
                                {images.map((img, i) => (
                                    <div 
                                        key={i} 
                                        onClick={() => setIndex(i)}
                                        className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${index === i ? 'border-primary ring-4 ring-primary/20' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                    >
                                        <img src={img} className="h-full w-full object-cover" alt="Thumbnail" />
                                    </div>
                                ))}
                             </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
