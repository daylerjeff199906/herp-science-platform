'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowLeft, ArrowRight, Image as ImageIcon } from 'lucide-react'
import { Button } from '@repo/ui/components/ui/button'

export function MultimediaSection() {
    const t = useTranslations('Home.multimedia')

    // Placeholder data for the gallery
    const images = [1, 2, 3, 4]

    return (
        <section className="py-20 bg-gray-50">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
                            {t('tag')}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            {t('title')}
                        </h2>
                        <p className="text-gray-500 mt-2 text-lg">{t('subtitle')}</p>
                    </div>

                    <Button variant="outline" className="hidden md:flex gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-full">
                        {t('cta')}
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[300px]">
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className={`group relative overflow-hidden rounded-2xl bg-gray-200 transition-all cursor-pointer ${i === 0 ? 'col-span-2 md:col-span-2 md:row-span-2 md:auto-rows-[620px]' : ''}`}
                        >
                            {/* Placeholder Skeleton */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-300 bg-gray-100 group-hover:scale-105 transition-transform duration-700">
                                <ImageIcon className="w-12 h-12 md:w-16 md:h-16 opacity-20" />
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                <span className="text-white font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    Specimen #{3580 + i}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 md:hidden">
                    <Button className="w-full gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-full" variant="outline">
                        {t('cta')}
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </section>
    )
}
