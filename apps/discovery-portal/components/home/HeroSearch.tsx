"use client"

import * as React from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@repo/ui/components/ui/input"
import { useRouter } from "@/i18n/routing"
import { ROUTES } from "@/config/routes"
import { useDebounce } from "@/hooks/useDebounce"
import { fetchIndividuals } from "@repo/networking/services/individuals"
import { Individual } from "@repo/shared-types"
import { cn } from "@repo/ui"
import Image from "next/image"
import { useTranslations } from "next-intl"

interface HeroSearchProps {
    placeholder?: string
    className?: string
}

export function HeroSearch({ placeholder, className }: HeroSearchProps) {
    const router = useRouter()
    const t = useTranslations('Hero')
    const [query, setQuery] = React.useState("")
    const [isOpen, setIsOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [suggestions, setSuggestions] = React.useState<Individual[]>([])
    const containerRef = React.useRef<HTMLDivElement>(null)

    const debouncedQuery = useDebounce(query, 300)

    // Handle outside click to close suggestions
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Fetch suggestions
    React.useEffect(() => {
        const fetchSuggestions = async () => {
            if (!debouncedQuery || debouncedQuery.length < 2) {
                setSuggestions([])
                return
            }

            setIsLoading(true)
            try {
                // We'll search by typing, which usually matches common name or scientific name
                // The API might support a general 'search' or we filter by specific fields
                const response = await fetchIndividuals({
                    page: 1,
                    pageSize: 5,
                    searchTerm: debouncedQuery
                })
                setSuggestions(response.data || [])
                setIsOpen(true)
            } catch (error) {
                console.error("Error fetching suggestions:", error)
                setSuggestions([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchSuggestions()
    }, [debouncedQuery])

    const handleSearch = () => {
        if (!query.trim()) return
        setIsOpen(false)
        router.push(`${ROUTES.COLLECTIONS}?searchTerm=${encodeURIComponent(query)}`)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    const handleSuggestionClick = (individual: Individual) => {
        setIsOpen(false)
        router.push(`${ROUTES.COLLECTIONS}/${individual.id}`)
    }

    return (
        <div ref={containerRef} className="relative w-full max-w-md group">
            <div className="relative">
                <Input
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        if (e.target.value.length === 0) setIsOpen(false)
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (suggestions.length > 0) setIsOpen(true)
                    }}
                    placeholder={placeholder || t('searchPlaceholder')}
                    className={cn(
                        "w-full h-14 pl-6 pr-12 bg-transparent border-[1.5px] border-[#ADDE60]/30 hover:border-[#ADDE60] text-white placeholder:text-white/60 focus-visible:ring-1 focus-visible:ring-[#ADDE60] focus-visible:border-[#ADDE60] transition-all rounded-full text-lg",
                        className
                    )}
                />

                <button
                    onClick={handleSearch}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[#ADDE60]/80 group-hover:text-[#ADDE60] transition-colors"
                >
                    {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <Search className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 border border-slate-100 dark:border-slate-800">
                    <ul className="py-2">
                        {suggestions.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => handleSuggestionClick(item)}
                                    className="w-full text-left px-4 py-3 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                                        {item.files?.images && item.files.images.length > 0 ? (
                                            <Image
                                                src={item.files.images[0]?.name || ''}
                                                alt={item.species.scientificName}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                                                No img
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                                            {item.species.scientificName}
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            {item.species.commonName || t('unknown')}
                                        </span>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
