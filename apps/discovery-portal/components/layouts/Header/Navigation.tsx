'use client'

import React from 'react'
import { Link, usePathname } from '../../../i18n/routing'
import { useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import { NavItem } from './types'

export const navItems: { label: string; href: string; children?: any[] }[] = [
    { label: 'home', href: '/' },
    { label: 'collections', href: '/colecciones' },
    { label: 'gallery', href: '/galeria' },
    { label: 'viewer', href: '/visor' },
    { label: 'deposit', href: '/como-depositar' },
]

export function Navigation({
    scrolled,
}: {
    scrolled: boolean
}) {
    const pathname = usePathname()
    const t = useTranslations('Header.nav')

    return (
        <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
                const isActive = pathname === item.href

                return (
                    <div key={item.label} className="relative group px-3 py-2">
                        <Link
                            href={item.href}
                            className={`
              flex items-center gap-1 text-sm font-medium transition-colors
              ${isActive
                                    ? 'text-[#ADDE60] font-semibold'
                                    : scrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-white/90 hover:text-white'
                                }
            `}
                        >
                            {t(item.label)}
                            {item.children && <ChevronDown className="w-4 h-4" />}
                        </Link>

                        {/* Dropdown (Simple CSS-based) */}
                        {item.children && (
                            <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-out z-50">
                                <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2 min-w-[200px] overflow-hidden">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.label}
                                            href={child.href}
                                            className="block px-4 py-2.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                        >
                                            {child.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </nav>
    )
}
