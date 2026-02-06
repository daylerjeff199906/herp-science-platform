'use client'

import React, { useMemo } from 'react';
import { SlidersHorizontal, X, Filter } from 'lucide-react';
import { SmartFilter, Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, Badge, Button } from '@repo/ui'; // Consolidated import provided @repo/ui exports them
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export const CollectionsFilters = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Helper to update URL params
    const updateFilter = (key: string, value: any) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))

        if (value === null || value === undefined || value === '' || value === 'all' || value === false) {
            current.delete(key)
        } else {
            current.set(key, String(value))
        }

        const search = current.toString()
        const query = search ? `?${search}` : ""

        router.push(`${pathname}${query}`)
    }

    // Clear all filters
    const clearAll = () => {
        router.push(pathname)
    }

    // Get active filters count
    const activeCount = useMemo(() => {
        let count = 0;
        searchParams.forEach((value, key) => {
            // Ignore view param or other technical params if any
            if (key !== 'view' && key !== 'page') count++
        })
        return count
    }, [searchParams])

    // Render Filter Controls (Reusable)
    const FilterControls = () => (
        <div className="space-y-6">
            <SmartFilter
                type="text"
                placeholder="Buscar especie..."
                value={searchParams.get('q') || ''}
                onChange={(val) => updateFilter('q', val)}
                debounceMs={500}
            />

            <SmartFilter
                type="select"
                label="Sexo"
                value={searchParams.get('sex')}
                onChange={(val) => updateFilter('sex', val)}
                options={[
                    { label: 'Todos', value: 'all' },
                    { label: 'Macho', value: 'male' },
                    { label: 'Hembra', value: 'female' },
                    { label: 'Indeterminado', value: 'unknown' }
                ]}
            />

            <SmartFilter
                type="switch"
                label="Con Huevos"
                value={searchParams.get('hasEggs') === 'true'}
                onChange={(val) => updateFilter('hasEggs', val)}
            />

            <SmartFilter
                type="radio"
                label="Estado"
                value={searchParams.get('status') || 'all'}
                onChange={(val) => updateFilter('status', val)}
                options={[
                    { label: 'Todos', value: 'all' },
                    { label: 'Vivo', value: 'alive' },
                    { label: 'Preservado', value: 'preserved' }
                ]}
            />

            {/* Example Async Select - Mocked */}
            <SmartFilter
                type="async-select"
                label="Taxonomía"
                value={searchParams.get('taxonomy')}
                onChange={(val) => updateFilter('taxonomy', val)}
                loadOptions={async (query) => {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    return {
                        options: [
                            { label: 'Amphibia', value: '1' },
                            { label: 'Reptilia', value: '2' },
                            { label: 'Aves', value: '3' }
                        ].filter(o => o.label.toLowerCase().includes(query.toLowerCase())),
                        hasMore: false
                    }
                }}
            />
        </div>
    )

    // Render Active Badges
    const ActiveFilters = () => {
        if (activeCount === 0) return null;

        return (
            <div className="flex flex-wrap gap-2 mb-4">
                {Array.from(searchParams.entries()).map(([key, value]) => {
                    if (key === 'view' || key === 'page') return null;
                    return (
                        <Badge key={key} variant="secondary" className="gap-1 pl-2 pr-1 py-1 cursor-pointer hover:bg-slate-200" onClick={() => updateFilter(key, null)}>
                            <span className="capitalize">{key}: {value}</span>
                            <X size={12} />
                        </Badge>
                    )
                })}
                <button onClick={clearAll} className="text-xs text-red-500 font-medium hover:underline flex items-center">
                    Borrar todos
                </button>
            </div>
        )
    }

    // --- Main Render ---
    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0 space-y-4">
                <div className='p-4 bg-white rounded-xl border border-gray-100 shadow-sm sticky top-24'>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                            <SlidersHorizontal size={18} />
                            Filtros
                        </h3>
                        {activeCount > 0 && (
                            <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                                {activeCount}
                            </Badge>
                        )}
                    </div>

                    <ActiveFilters />
                    <FilterControls />
                </div>
            </aside>

            {/* Mobile Sheet Trigger */}
            <div className="lg:hidden mb-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full flex justify-between items-center bg-white border-gray-200">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal size={16} />
                                <span>Filtrar resultados</span>
                            </div>
                            {activeCount > 0 && (
                                <Badge className="bg-blue-600 h-5 w-5 p-0 flex items-center justify-center rounded-full">
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

                        <ActiveFilters />
                        <FilterControls />

                        <div className="mt-8 pt-4 border-t sticky bottom-0 bg-background pb-4">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={(e) => {
                                // Close sheet logic is implied by native sheet behavior if clicking outside or we can control it if needed. 
                                // For now, standard behavior. User sees results update immediately as they change filters.
                                const closeBtn = document.querySelector('[data-radix-collection-item]') as HTMLElement;
                                if (closeBtn) closeBtn.click(); // Hacky close or just let user swipe.
                                // Actually, typically users want an "Apply" button or live update. Live update is implemented.
                            }}>
                                Ver {activeCount > 0 ? `resultados filtrados` : 'resultados'}
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
};

