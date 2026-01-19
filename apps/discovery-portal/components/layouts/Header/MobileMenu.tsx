'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronRight, ArrowRight } from 'lucide-react'
import { navItems } from './Navigation'

export function MobileMenu({ scrolled }: { scrolled: boolean }) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

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
                        <div className="p-6 flex items-center justify-between border-b border-gray-100">
                            <span className="font-bold text-xl text-emerald-950 tracking-tight">Menú</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 -mr-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-6">
                            <nav className="flex flex-col px-4 gap-2">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href

                                    return (
                                        <div key={item.label}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all font-medium border
                                                ${isActive
                                                        ? 'bg-[#ADDE60]/10 text-emerald-900 border-[#ADDE60]/20'
                                                        : 'bg-gray-50 text-gray-600 border-transparent hover:bg-emerald-50 hover:text-emerald-900'
                                                    }
                                            `}
                                            >
                                                <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>
                                                {isActive ? (
                                                    <div className="w-2 h-2 rounded-full bg-[#ADDE60]" />
                                                ) : (
                                                    item.children && <ChevronRight className="w-4 h-4 text-gray-400" />
                                                )}
                                            </Link>
                                        </div>
                                    )
                                })}
                            </nav>
                        </div>

                        <div className="p-6 border-t border-gray-100 space-y-4 bg-gray-50/50">
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="group flex items-center justify-center w-full py-4 px-6 bg-[#ADDE60] hover:bg-[#9cc954] text-emerald-950 font-bold rounded-2xl transition-all shadow-lg shadow-[#ADDE60]/20 hover:shadow-[#ADDE60]/40 hover:-translate-y-0.5"
                            >
                                <span>Unirte ahora</span>
                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-400 font-medium">
                                <span className="text-emerald-600">ES</span>
                                <span className="w-px h-3 bg-gray-300"></span>
                                <span className="hover:text-gray-600 cursor-pointer transition-colors">EN</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
