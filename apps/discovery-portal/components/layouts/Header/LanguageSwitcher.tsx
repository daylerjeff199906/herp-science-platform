'use client'

import { useState, useRef, useEffect } from 'react'
import { Link, usePathname } from '../../../i18n/routing'
import { cn } from '@repo/ui/lib/utils'
import { useLocale } from 'next-intl'
import { ChevronDown, Globe } from 'lucide-react'
import { FlagPE, FlagUS, FlagBR } from './Flags'

export function LanguageSwitcher({ className, scrolled }: { className?: string, scrolled?: boolean }) {
    const pathname = usePathname()
    const locale = useLocale()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const locales = [
        { code: 'es', label: 'ES', flag: FlagPE },
        { code: 'en', label: 'EN', flag: FlagUS },
        { code: 'pt', label: 'PT', flag: FlagBR }
    ]

    const currentLocale = locales.find(l => l.code === locale) ?? locales[0]!

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200",
                    scrolled
                        ? "bg-white/50 border-gray-200 hover:bg-white hover:border-emerald-200 text-gray-700"
                        : "bg-white/10 border-white/20 hover:bg-white/20 text-white backdrop-blur-sm",
                    isOpen && "ring-2 ring-emerald-500/20 border-emerald-500/50"
                )}
            >
                <currentLocale.flag className="w-5 h-5 rounded-full object-cover shadow-sm" />
                <span className="text-sm font-semibold">{currentLocale.label}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {locales.map((l) => (
                        <Link
                            key={l.code}
                            href={pathname}
                            locale={l.code}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-emerald-50",
                                locale === l.code ? "text-emerald-600 bg-emerald-50/50" : "text-gray-600"
                            )}
                            onClick={() => setIsOpen(false)}
                        >
                            <l.flag className="w-4 h-4 rounded-full object-cover shadow-sm" />
                            <span>{l.label}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
