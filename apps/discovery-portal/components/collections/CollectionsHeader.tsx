'use client'

import React, { useMemo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Download, Filter, SlidersHorizontal } from 'lucide-react'
import {
    SmartFilter,
    Button,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    Badge
} from '@repo/ui'
import { ViewToggler } from './ViewToggler'
import { CollectionsFilterContent } from './CollectionsFilterContent'

export const CollectionsHeader = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // --- Search Handler ---
    const updateSearch = (val: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        if (!val) {
            current.delete('searchTerm')
        } else {
            current.set('searchTerm', val)
        }

        // Reset page when searching
        current.delete('page')

        const search = current.toString()
        const query = search ? `?${search}` : ""
        router.push(`${pathname}${query}`)
    }

    // --- Active Count for Mobile Trigger ---
    const activeCount = useMemo(() => {
        let count = 0;
        searchParams.forEach((_, key) => {
            if (key !== 'view' && key !== 'page' && key !== 'pageSize' && key !== 'searchTerm') count++
        })
        return count
    }, [searchParams])

    return (
        <div className="sticky top-0 lg:top-20 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 mb-6">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-4 sm:px-0">

                {/* Left: Search Bar */}
                <div className='w-full md:w-1/2 lg:w-1/3'>
                    <SmartFilter
                        type="text"
                        placeholder="Buscar especie, código..."
                        value={searchParams.get('searchTerm') || ''}
                        onChange={updateSearch}
                        debounceMs={500}
                        className="w-full h-10 shadow-sm"
                    />
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">

                    {/* View Toggler */}
                    <div className="hidden sm:block">
                        <ViewToggler />
                    </div>

                    {/* Download Button */}
                    <Button
                        variant="default" // Using default which is usually primary
                        className="bg-black text-white hover:bg-gray-800 rounded-full gap-2 shadow-sm"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">Descargar</span>
                    </Button>

                    {/* Mobile Filter Trigger (Hidden on Desktop) */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="gap-2 rounded-full border-gray-300 relative">
                                    <SlidersHorizontal size={16} />
                                    <span>Filtros</span>
                                    {activeCount > 0 && (
                                        <Badge className="bg-blue-600 h-5 w-5 p-0 flex items-center justify-center rounded-full absolute -top-1 -right-1">
                                            {activeCount}
                                        </Badge>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                                <SheetHeader className="mb-6">
                                    <SheetTitle className="flex items-center gap-2">
                                        <Filter size={20} />
                                        Filtros
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="py-4">
                                    {/* Reuse the filter content component */}
                                    <CollectionsFilterContent />
                                </div>

                                <div className="mt-8 pt-4 border-t sticky bottom-0 bg-background pb-4">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                        Ver resultados
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Mobile View Toggler (if we want it to show on very small screens, or we can just rely on the hidden sm:block above being sufficient, but usually good to have access) */}
                    <div className="sm:hidden">
                        <ViewToggler />
                    </div>

                </div>
            </div>
        </div>
    )
}
