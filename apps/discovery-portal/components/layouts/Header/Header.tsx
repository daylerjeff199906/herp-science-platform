'use client'

import React, { useEffect, useState } from 'react'
import { Link, usePathname } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { LogoRender } from '@repo/ui/logo'
import { Navigation } from './Navigation'
import { MobileMenu } from './MobileMenu'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ModeToggle } from '../ModeToggle'
import { ROUTES } from '@/config/routes'

export function Header() {
    const [scrolled, setScrolled] = useState(false)
    const t = useTranslations('Header')
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled)
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [scrolled])

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled
                ? 'bg-[#111111]/90 backdrop-blur-md shadow-sm border-b border-white/5 py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    {/* Logo Area */}
                    <Link href={ROUTES.HOME} className="relative z-50 flex items-center gap-2 group">
                        <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                            <LogoRender
                                className={`w-full h-full object-contain transition-all duration-300 ${scrolled ? 'brightness-0 invert' : 'brightness-0 invert'
                                    }`}
                            />
                        </div>
                        <div className={`flex flex-col leading-none transition-colors duration-300 ${scrolled ? 'text-white' : 'text-white'
                            }`}>
                            <span className="font-bold text-lg tracking-tight">Vertebrados</span>
                            <span className="text-[10px] font-medium opacity-80 uppercase tracking-wider">Discovery Portal</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <Navigation scrolled={scrolled} />

                    {/* Actions Area */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Language Switcher */}
                        <LanguageSwitcher
                            scrolled={scrolled}
                            className={`transition-colors text-white/90`}
                        />

                        <Link
                            href={ROUTES.LOGIN}
                            className={`
                px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0
                ${scrolled
                                    ? 'bg-[#ADDE60] text-[#111] hover:bg-white hover:text-[#111] shadow-[#ADDE60]/20'
                                    : 'bg-white text-emerald-900 hover:bg-[#ADDE60] hover:text-emerald-950 shadow-black/10'
                                }
              `}
                        >
                            {t('join')}
                        </Link>

                        <ModeToggle />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <MobileMenu scrolled={scrolled} />
                </div>
            </div>
        </header >
    )
}
