'use client'
import React, { useState } from 'react'
import { Link, usePathname } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { navItems } from './Navigation'

export function MobileMenu({ scrolled }: { scrolled: boolean }) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const tNav = useTranslations('Header.nav')

    // Prevent scroll when menu is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const currentYear = new Date().getFullYear()

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className={`p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                    }`}
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Overlay & Drawer */}
            <div
                className={`fixed inset-0 z-50 transition-all duration-500 ${isOpen ? 'visible' : 'invisible'
                    }`}
            >
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-emerald-950/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                    onClick={() => setIsOpen(false)}
                />

                {/* Drawer Content */}
                <div
                    className={`absolute top-0 right-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="flex flex-col h-full">
                        {/* Header: Close Button Only */}
                        <div className="p-6 flex items-center justify-end">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 -mr-2 text-gray-800 hover:text-emerald-600 rounded-full transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 overflow-y-auto px-8 py-4">
                            <nav className="flex flex-col gap-6">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <div key={item.label}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`text-2xl transition-colors font-medium
                                                    ${isActive
                                                        ? 'text-emerald-900 font-semibold'
                                                        : 'text-emerald-950/80 hover:text-emerald-700'
                                                    }
                                                `}
                                            >
                                                {tNav(item.label)}
                                            </Link>
                                        </div>
                                    )
                                })}
                            </nav>
                        </div>

                        {/* Footer: Copyright */}
                        <div className="p-8 border-t border-gray-100 mt-auto">
                            <p className="text-xs text-gray-400">
                                © {currentYear} Instituto de Investigaciones de la Amazonía Peruana
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
