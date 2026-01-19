'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { LogoRender } from '@repo/ui/logo'
import { Navigation } from './Navigation'
import { MobileMenu } from './MobileMenu'
import { Globe } from 'lucide-react'

export function Header() {
    const [scrolled, setScrolled] = useState(false)

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
                ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    {/* Logo Area */}
                    <Link href="/" className="relative z-50 flex items-center gap-2 group">
                        <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                            <LogoRender
                                className={`w-full h-full object-contain transition-all duration-300 ${scrolled ? 'brightness-100' : 'brightness-0 invert'
                                    }`}
                            />
                        </div>
                        <div className={`flex flex-col leading-none transition-colors duration-300 ${scrolled ? 'text-gray-900' : 'text-white'
                            }`}>
                            <span className="font-bold text-lg tracking-tight">Vertebrados</span>
                            <span className="text-[10px] font-medium opacity-80 uppercase tracking-wider">Discovery Portal</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <Navigation scrolled={scrolled} />

                    {/* Actions Area */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Language Switcher Placeholder */}
                        <button
                            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-emerald-600' : 'text-white/90 hover:text-white'
                                }`}
                        >
                            <Globe className="w-4 h-4" />
                            <span>ES</span>
                        </button>

                        <Link
                            href="/login"
                            className={`
                px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0
                ${scrolled
                                    ? 'bg-emerald-600 text-white hover:bg-[#ADDE60] hover:text-emerald-950 shadow-emerald-600/20'
                                    : 'bg-white text-emerald-900 hover:bg-[#ADDE60] hover:text-emerald-950 shadow-black/10'
                                }
              `}
                        >
                            Unirte
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <MobileMenu scrolled={scrolled} />
                </div>
            </div>
        </header >
    )
}
