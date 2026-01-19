'use client'

import { Link, usePathname } from '../../../i18n/routing'
import { cn } from '@repo/ui/lib/utils'

export function LanguageSwitcher({ className, scrolled }: { className?: string, scrolled?: boolean }) {
    const pathname = usePathname()

    // Simplified circular flags for generic use
    const FlagPE = () => (
        <svg viewBox="0 0 32 32" className="w-5 h-5 rounded-full object-cover border border-black/10 shadow-sm" aria-hidden="true">
            <rect width="32" height="32" fill="#D91023" />
            <rect x="10" width="12" height="32" fill="#FFFFFF" />
        </svg>
    )

    const FlagUS = () => (
        <svg viewBox="0 0 32 32" className="w-5 h-5 rounded-full object-cover border border-black/10 shadow-sm" aria-hidden="true">
            <rect width="32" height="32" fill="#B22234" />
            <path d="M0,4 h32 M0,8 h32 M0,12 h32 M0,16 h32 M0,20 h32 M0,24 h32 M0,28 h32" stroke="#FFFFFF" strokeWidth="2" />
            <rect width="14" height="16" fill="#3C3B6E" />
            {/* Simplified stars representation */}
            <circle cx="2" cy="2" r="1" fill="#FFFFFF" opacity="0.8" />
            <circle cx="7" cy="8" r="1" fill="#FFFFFF" opacity="0.8" />
            <circle cx="12" cy="14" r="1" fill="#FFFFFF" opacity="0.8" />
            <circle cx="12" cy="2" r="1" fill="#FFFFFF" opacity="0.8" />
            <circle cx="2" cy="14" r="1" fill="#FFFFFF" opacity="0.8" />
        </svg>
    )

    const FlagBR = () => (
        <svg viewBox="0 0 32 32" className="w-5 h-5 rounded-full object-cover border border-black/10 shadow-sm" aria-hidden="true">
            <rect width="32" height="32" fill="#009C3B" />
            <path d="M16 4 L28 16 L16 28 L4 16 Z" fill="#FFDF00" />
            <circle cx="16" cy="16" r="6" fill="#002776" />
        </svg>
    )

    const linkBaseClass = `flex items-center gap-1.5 hover:text-emerald-500 transition-all hover:scale-105 active:scale-95`

    return (
        <div className={cn("flex items-center gap-4 text-sm font-semibold", className)}>
            <Link href={pathname} locale="es" className={linkBaseClass}>
                <FlagPE />
                <span>ES</span>
            </Link>
            <span className={cn("w-px h-3", scrolled ? "bg-gray-300" : "bg-white/20")}></span>
            <Link href={pathname} locale="en" className={linkBaseClass}>
                <FlagUS />
                <span>EN</span>
            </Link>
            <span className={cn("w-px h-3", scrolled ? "bg-gray-300" : "bg-white/20")}></span>
            <Link href={pathname} locale="pt" className={linkBaseClass}>
                <FlagBR />
                <span>PT</span>
            </Link>
        </div>
    )
}
