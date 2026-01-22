'use client'

import { useTranslations } from 'next-intl'
import { ArrowRight, ExternalLink, ImageIcon } from 'lucide-react'
import { Button } from '@repo/ui/components/ui/button'
import { useIndividuals } from '@repo/networking'
import Image from 'next/image'
import Link from 'next/link'

export function MultimediaSection() {
    const t = useTranslations('Home.multimedia')

    const { data } = useIndividuals({
        page: 1,
        pageSize: 10,
        hasImages: 1,
        orderBy: 'commonName',
        orderType: 'DESC',
    })

    const galleryItems = data?.data || []

    return (
        <section className="py-24 bg-[#111111] relative overflow-hidden border-t border-white/5">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ADDE60]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="container px-4 md:px-6 mx-auto relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[#ADDE60] text-lg font-bold">+</span>
                            <span className="text-gray-400 font-medium uppercase tracking-widest text-sm">
                                {t('tag')}
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            {t('title')}
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                            {t('subtitle')}
                        </p>
                    </div>

                    <Button
                        asChild
                        variant="outline"
                        className="hidden md:flex gap-2 border-white/20 text-white hover:bg-[#ADDE60] hover:text-[#111] hover:border-[#ADDE60] rounded-full px-8 h-12 transition-all duration-300 uppercase tracking-wider text-sm"
                    >
                        <Link href="/gallery">
                            {t('cta')}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>

                {/* Gallery Grid - Bento Style */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
                    {galleryItems.map((item, i) => (
                        <div
                            key={item.id}
                            className={`group relative overflow-hidden rounded-2xl bg-[#1a1a1a] border border-white/5 hover:border-[#ADDE60]/50 transition-all duration-500 cursor-pointer ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''
                                } ${i === 3 ? 'md:col-span-2' : ''}`}
                        >
                            <Link href={`/collections/${item.id}`} className="block h-full w-full">
                                {/* Image Placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center bg-[#151515] group-hover:scale-105 transition-transform duration-700">
                                    {item.files.images && item.files.images.length > 0 ? (
                                        <Image
                                            src={item.files.images[0]?.name || ''}
                                            alt={item.species.scientificName}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <ImageIcon className={`text-gray-800 ${i === 0 ? 'w-24 h-24' : 'w-12 h-12'}`} strokeWidth={1} />
                                    )}
                                </div>

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                                {/* Content */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <span className="text-[#ADDE60] text-xs font-mono mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        {item.species.genus?.family?.name || 'Familia desconocida'}
                                    </span>
                                    <div className="flex justify-between items-end">
                                        <h3 className={`text-white font-medium ${i === 0 ? 'text-2xl' : 'text-lg'}`}>
                                            {item.species.scientificName}
                                        </h3>
                                        <ExternalLink className="w-5 h-5 text-[#ADDE60] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Mobile CTA */}
                <div className="mt-12 md:hidden">
                    <Button asChild className="w-full gap-2 bg-[#ADDE60] text-[#111] hover:bg-[#9cc954] rounded-full h-12 uppercase tracking-wide font-bold">
                        <Link href="/gallery">
                            {t('cta')}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
