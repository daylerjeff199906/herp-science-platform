'use client'

import React, { useMemo } from 'react';
import { SlidersHorizontal, X, Filter } from 'lucide-react';
import { SmartFilter, Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, Badge, Button } from '@repo/ui'; // Consolidated import provided @repo/ui exports them
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
    useSexes,
    fetchClasses, fetchClassById,
    fetchOrders, fetchOrderById,
    fetchFamilies, fetchFamilyById,
    fetchGenera, fetchGenusById,
    useClasses,
    useOrders,
    useFamilies,
    useGenera
} from '@repo/networking';
import { useQuery } from '@tanstack/react-query';

export const CollectionsFilters = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()


    // helper to get param
    const getParam = (k: string) => searchParams.get(k)
    const classId = getParam('classId')
    const orderId = getParam('orderId')
    const familyId = getParam('familyId')
    const genusId = getParam('genusId')

    // --- Update Handler with Cascade Clear ---
    const updateFilter = (key: string, value: any) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))

        // Cascade logic: Clear children when parent changes
        if (key === 'classId') {
            current.delete('orderId')
            current.delete('familyId')
            current.delete('genusId')
        }
        if (key === 'orderId') {
            current.delete('familyId')
            current.delete('genusId')
        }
        if (key === 'familyId') {
            current.delete('genusId')
        }

        if (value === null || value === undefined || value === '' || value === 'all' || value === false) {
            current.delete(key)
        } else {
            current.set(key, String(value))
        }

        const search = current.toString()
        const query = search ? `?${search}` : ""

        if (current.toString() === searchParams.toString()) return

        router.push(`${pathname}${query}`)
    }

    const clearAll = () => {
        router.push(pathname)
    }

    const activeCount = useMemo(() => {
        let count = 0;
        searchParams.forEach((_, key) => {
            if (key !== 'view' && key !== 'page' && key !== 'pageSize') count++
        })
        return count
    }, [searchParams])

    // --- Data Fetching for Selects ---

    // 1. Sexes (Small list)
    const { data: sexes } = useSexes({ pageSize: 100 })
    const sexOptions = useMemo(() => {
        if (!sexes?.data) return []
        return sexes.data.map(s => ({ label: s.name, value: s.id.toString() }))
    }, [sexes])

    // 2. Initial Data Hooks (Fetch first page for immediate display on open)
    const { data: initialClasses } = useClasses({ pageSize: 20 })
    const { data: initialOrders } = useOrders({ pageSize: 20, classId: classId ? Number(classId) : undefined, })
    const { data: initialFamilies } = useFamilies({ pageSize: 20, orderId: orderId ? Number(orderId) : undefined })
    const { data: initialGenera } = useGenera({ pageSize: 20, familyId: familyId ? Number(familyId) : undefined })

    // Helper to map response data to options
    const mapToOptions = (data: any[] | undefined) => {
        if (!data) return []
        return data.map(i => ({ label: i.name, value: i.id.toString() }))
    }

    // --- Helper for Selected Item Label ---
    // We fetching the specific selected item to display its name correctly if it's not in the initial page
    const useInitialOption = (id: string | null, fetchFn: (id: number) => Promise<any>, key: string, initialList: any[] | undefined) => {
        const { data } = useQuery({
            queryKey: [key, id],
            queryFn: () => fetchFn(Number(id)),
            enabled: !!id && !initialList?.find(i => String(i.id) === id), // Only fetch if ID exists AND not already in initial list
            staleTime: Infinity
        })

        // If we have the item in the initial list, use it. Otherwise use the fetched individual item.
        const foundInList = initialList?.find(i => String(i.id) === id)
        if (foundInList) return [{ label: foundInList.name, value: foundInList.id.toString() }]

        return data ? [{ label: data.name, value: data.id.toString() }] : []
    }

    const selectedClassOpt = useInitialOption(classId, fetchClassById, 'class-initial', initialClasses?.data)
    const selectedOrderOpt = useInitialOption(orderId, fetchOrderById, 'order-initial', initialOrders?.data)
    const selectedFamilyOpt = useInitialOption(familyId, fetchFamilyById, 'family-initial', initialFamilies?.data)
    const selectedGenusOpt = useInitialOption(genusId, fetchGenusById, 'genus-initial', initialGenera?.data)

    // Render Filter Controls
    const FilterControls = () => (
        <div className="space-y-6">
            <SmartFilter
                type="text"
                placeholder="Buscar especie, código..."
                value={searchParams.get('searchTerm') || ''}
                onChange={(val) => updateFilter('searchTerm', val)}
                debounceMs={500}
            />

            <SmartFilter
                type="select"
                label="Sexo"
                value={searchParams.get('sexId')}
                onChange={(val) => updateFilter('sexId', val)}
                options={sexOptions}
                placeholder="Todos"
            />

            {/* CLASE */}
            <SmartFilter
                type="async-select"
                label="Clase"
                value={classId}
                onChange={(val) => updateFilter('classId', val)}
                // Show initial list immediately, plus the selected item if handled
                options={selectedClassOpt.length > 0 ? selectedClassOpt : mapToOptions(initialClasses?.data)}
                loadOptions={async (query, page) => {
                    const res = await fetchClasses({ name: query, page, pageSize: 20 })
                    return {
                        options: mapToOptions(res.data),
                        hasMore: res.currentPage < res.totalPages
                    }
                }}
            />

            {/* ORDEN (Depends on Class) */}
            <SmartFilter
                type="async-select"
                label="Orden"
                value={orderId}
                onChange={(val) => updateFilter('orderId', val)}
                options={selectedOrderOpt.length > 0 ? selectedOrderOpt : mapToOptions(initialOrders?.data)}
                loadOptions={async (query, page) => {
                    const res = await fetchOrders({
                        name: query,
                        page,
                        pageSize: 20,
                        classId: classId ? Number(classId) : undefined // Filter by parent
                    })
                    return {
                        options: mapToOptions(res.data),
                        hasMore: res.currentPage < res.totalPages
                    }
                }}
            />

            {/* FAMILIA (Depends on Order) */}
            <SmartFilter
                type="async-select"
                label="Familia"
                value={familyId}
                onChange={(val) => updateFilter('familyId', val)}
                options={selectedFamilyOpt.length > 0 ? selectedFamilyOpt : mapToOptions(initialFamilies?.data)}
                loadOptions={async (query, page) => {
                    const res = await fetchFamilies({
                        name: query,
                        page,
                        pageSize: 20,
                        orderId: orderId ? Number(orderId) : undefined
                    })
                    return {
                        options: mapToOptions(res.data),
                        hasMore: res.currentPage < res.totalPages
                    }
                }}
            />

            {/* GENERO (Depends on Family) */}
            <SmartFilter
                type="async-select"
                label="Género"
                value={genusId}
                onChange={(val) => updateFilter('genusId', val)}
                options={selectedGenusOpt.length > 0 ? selectedGenusOpt : mapToOptions(initialGenera?.data)}
                loadOptions={async (query, page) => {
                    const res = await fetchGenera({
                        name: query,
                        page,
                        pageSize: 20,
                        familyId: familyId ? Number(familyId) : undefined
                    })
                    return {
                        options: mapToOptions(res.data),
                        hasMore: res.currentPage < res.totalPages
                    }
                }}
            />

            <SmartFilter
                type="switch"
                label="Con Huevos"
                value={searchParams.get('hasEggs') === '1'}
                onChange={(val) => updateFilter('hasEggs', val ? '1' : null)}
            />

            <SmartFilter
                type="switch"
                label="Con Imagenes"
                value={searchParams.get('hasImages') === '1'}
                onChange={(val) => updateFilter('hasImages', val ? '1' : null)}
            />
        </div>
    )

    // Render Active Badges
    const ActiveFilters = () => {
        if (activeCount === 0) return null;

        return (
            <div className="flex flex-wrap gap-2 mb-4">
                {Array.from(searchParams.entries()).map(([key, value]) => {
                    if (['view', 'page', 'pageSize', 'orderBy', 'orderType'].includes(key)) return null;
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
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => {
                                // Close logic handled by UI
                            }}>
                                Ver resultados
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
};

