'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@repo/ui/components/ui/button'

export function AboutSection() {
    const t = useTranslations('Home.about')

    return (
        <section className="py-20 bg-white overflow-hidden relative">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                {t('tag')}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                {t('title')}
                            </h2>
                            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                                <p>{t('description')}</p>
                                <p>{t('description2')}</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 h-12 text-base">
                                {t('cta')}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>

                    {/* Image / Visuals */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
                            {/* Placeholder for About Image - User to replace */}
                            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center text-gray-400">
                                <span className="sr-only">About Image Placeholder</span>
                                <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            {/* Use next/image when asset is available */}
                            {/* <Image src="/about-image.jpg" alt="Collection" fill className="object-cover transition-transform duration-700 group-hover:scale-105" /> */}

                            {/* Decorative Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        {/* Floating Stat Card */}
                        <div className="absolute -bottom-8 -left-8 md:bottom-8 md:-left-12 bg-white p-6 rounded-xl border border-gray-100 max-w-xs animate-in slide-in-from-bottom-5 duration-700 delay-200">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                                    <Check className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-900">10,000+</p>
                                    <p className="text-gray-600 text-sm font-medium">Especímenes preservados</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
