"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

interface FacebookGalleryProps {
    images: string[]
}

function ImageWithSkeleton({ src, alt, className, onClick }: { src: string, alt: string, className?: string, onClick?: () => void }) {
    const [loaded, setLoaded] = useState(false)
    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`} onClick={onClick}>
            {!loaded && (
                <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
                </div>
            )}
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover transition-all duration-700 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                onLoad={() => setLoaded(true)}
            />
        </div>
    )
}

export function FacebookGallery({ images = [] }: FacebookGalleryProps) {
    const [index, setIndex] = useState<number | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (index !== null) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [index])

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
            <div className={`grid gap-2 overflow-hidden rounded-3xl h-[500px] border ${images.length === 1 ? "grid-cols-1" :
                images.length === 2 ? "grid-cols-2" :
                    "grid-cols-12"
                }`}>

                {/* 1 Image */}
                {images.length === 1 && (
                    <ImageWithSkeleton src={images[0] || ""} className="cursor-pointer hover:scale-105" onClick={() => openLightbox(0)} alt="Gallery" />
                )}

                {/* 2 Images */}
                {images.length === 2 && images.map((img, i) => (
                    <ImageWithSkeleton key={i} src={img} className="cursor-pointer hover:scale-105" onClick={() => openLightbox(i)} alt="Gallery" />
                ))}

                {/* 3 or more Images */}
                {images.length >= 3 && (
                    <>
                        <div className="col-span-12 md:col-span-8 h-full relative cursor-pointer overflow-hidden" onClick={() => openLightbox(0)}>
                            <ImageWithSkeleton src={images[0] || ""} className="hover:scale-105" alt="Gallery" />
                        </div>
                        <div className="col-span-12 md:col-span-4 grid grid-rows-2 md:grid-rows-none grid-cols-2 md:grid-cols-1 gap-2 h-full">
                            {images.slice(1, images.length === 3 ? 3 : images.length === 4 ? 4 : 5).map((img, i) => {
                                const isLast = i === displayImages.length - 2 && remainingCount > 0
                                return (
                                    <div key={i} className="relative h-full w-full cursor-pointer overflow-hidden" onClick={() => openLightbox(i + 1)}>
                                        <ImageWithSkeleton src={img} className="hover:scale-105" alt="Gallery" />
                                        {isLast && (
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
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

            {/* Lightbox / Facebook Style View with Portal */}
            {mounted && typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {index !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[10000] bg-black/98 backdrop-blur-3xl flex flex-col md:flex-row shadow-none"
                        >
                            {/* Main Image View */}
                            <div className="flex-1 relative flex items-center justify-center p-4 md:p-12">
                                <button onClick={closeLightbox} className="absolute top-6 left-6 text-white/70 hover:text-white transition-colors z-[110] bg-white/10 p-2 rounded-full border border-white/10">
                                    <X className="h-6 w-6" />
                                </button>

                                <div className="relative max-h-full max-w-full flex items-center justify-center">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.05 }}
                                            transition={{ duration: 0.2 }}
                                            className="relative flex items-center justify-center"
                                        >
                                            <img
                                                src={images[index] || ""}
                                                className="max-h-full max-w-full object-contain rounded-lg shadow-none"
                                                alt="Lightbox"
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                <div className="absolute inset-y-0 left-4 flex items-center">
                                    <button onClick={prev} className="bg-white/5 hover:bg-white/10 p-4 rounded-full text-white transition-all backdrop-blur-sm border border-white/10">
                                        <ChevronLeft className="h-8 w-8" />
                                    </button>
                                </div>
                                <div className="absolute inset-y-0 right-4 flex items-center">
                                    <button onClick={next} className="bg-white/5 hover:bg-white/10 p-4 rounded-full text-white transition-all backdrop-blur-sm border border-white/10">
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
                                        <p className="font-bold tracking-tight text-foreground uppercase text-base leading-none">IIAP Oficial</p>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Sedes Institucionales</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-base font-bold tracking-tighter leading-tight text-foreground uppercase">Galería de Infraestructura</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                        Explora a detalle nuestras instalaciones. Cada imagen captura la esencia de nuestro compromiso científico.
                                    </p>
                                </div>

                                <div className="pt-8 border-t border-muted-foreground/10 grid grid-cols-3 gap-2">
                                    {images.map((img, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setIndex(i)}
                                            className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${index === i ? 'border-primary ring-4 ring-primary/20 scale-95' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'}`}
                                        >
                                            <img src={img} className="h-full w-full object-cover" alt="Thumbnail" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    )
}
