'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronRight } from 'lucide-react'
import { NavItem } from './types'
import { navItems } from './Navigation'

export function MobileMenu({ scrolled }: { scrolled: boolean }) {
    const [isOpen, setIsOpen] = useState(false)

    // Prevent scroll when menu is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

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
                className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'
                    }`}
            >
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                    onClick={() => setIsOpen(false)}
                />

                {/* Drawer Content */}
                <div
                    className={`absolute top-0 right-0 h-full w-[80%] max-w-[300px] bg-white shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="flex flex-col h-full">
                        <div className="p-5 flex items-center justify-between border-b border-gray-100">
                            <span className="font-bold text-lg text-gray-900">Menú</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-4">
                            <nav className="flex flex-col px-3 gap-1">
                                {navItems.map((item) => (
                                    <div key={item.label}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center justify-between px-4 py-3 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all font-medium"
                                        >
                                            {item.label}
                                            {item.children && <ChevronRight className="w-4 h-4 text-gray-400" />}
                                        </Link>
                                        {/* Simplified mobile sub-menu structure for now - just listing children below if needed, or keeping it flat */}
                                    </div>
                                ))}
                            </nav>
                        </div>

                        <div className="p-5 border-t border-gray-100 space-y-3">
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-600/20"
                            >
                                Unirte
                            </Link>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 py-2">
                                <span>ES</span>
                                <span className="w-px h-3 bg-gray-300"></span>
                                <span className="text-gray-300">EN</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
