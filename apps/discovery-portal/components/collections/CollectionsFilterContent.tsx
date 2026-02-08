'use client'

import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import { SmartFilter, Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge } from '@repo/ui';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
    useSexes,
    fetchSexes,
    fetchClasses, fetchClassById,
    fetchOrders, fetchOrderById,
    fetchFamilies, fetchFamilyById,
    fetchGenera, fetchGenusById,
    useClasses
} from '@repo/networking';
import { useQuery } from '@tanstack/react-query';

export const CollectionsFilterContent = () => {
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
            if (key !== 'view' && key !== 'page' && key !== 'pageSize' && key !== 'searchTerm') count++
        })
        return count
    }, [searchParams])

    // --- Data Fetching for Selects ---

    // 1. Sexes (Small list)
    const { data: sexes } = useSexes({ pageSize: 100 })
    console.log('DEBUG: Sexes hook data', sexes)

    const sexOptions = useMemo(() => {
        if (!sexes?.data) return []
        return sexes.data.map(s => ({ label: s.name, value: s.id.toString() }))
    }, [sexes])

    // 2. Initial Data Hooks (Fetch first page for immediate display on open)
    const { data: initialClasses } = useClasses({ pageSize: 20 })

    const { data: initialOrders } = useQuery({
        queryKey: ['orders-initial', classId],
        queryFn: () => fetchOrders({ pageSize: 20, classId: classId ? Number(classId) : undefined }),
        enabled: !!classId
    })

    const { data: initialFamilies } = useQuery({
        queryKey: ['families-initial', orderId],
        queryFn: () => fetchFamilies({ pageSize: 20, orderId: orderId ? Number(orderId) : undefined }),
        enabled: !!orderId
    })

    const { data: initialGenera } = useQuery({
        queryKey: ['genera-initial', familyId],
        queryFn: () => fetchGenera({ pageSize: 20, familyId: familyId ? Number(familyId) : undefined }),
        enabled: !!familyId
    })

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

    // Render Active Badges
    const ActiveFilters = () => {
        if (activeCount === 0) return null;

        return (
            <div className="flex flex-wrap gap-2 mb-4">
                {Array.from(searchParams.entries()).map(([key, value]) => {
                    if (['view', 'page', 'pageSize', 'orderBy', 'orderType', 'searchTerm'].includes(key)) return null;
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

    return (
        <div className="space-y-4 w-full">
            <ActiveFilters />

            <Accordion type="multiple" defaultValue={['taxonomy', 'characteristics']} className="w-full">

                {/* GRUPO V: Taxonomía */}
                <AccordionItem value="taxonomy" className="border-b-0">
                    <AccordionTrigger className="text-sm font-semibold hover:no-underline py-2">Taxonomía</AccordionTrigger>
                    <AccordionContent className="pt-2 px-1 flex flex-col gap-4 lg:gap-6">
                        <div className="flex flex-col gap-2">
                            <SmartFilter
                                type="async-select"
                                label="Sexo"
                                value={searchParams.get('sexId')}
                                onChange={(val) => updateFilter('sexId', val)}
                                options={sexOptions}
                                loadOptions={async (query, page) => {
                                    const res = await fetchSexes({ name: query, page, pageSize: 20 })
                                    return {
                                        options: mapToOptions(res.data),
                                        hasMore: res.currentPage < res.totalPages
                                    }
                                }}
                                placeholder="Buscar sexo..."
                                hasMore={sexes ? sexes.currentPage < sexes.totalPages : false}
                            />

                            {/* CLASE */}
                            <SmartFilter
                                type="list-search"
                                label="Clase"
                                value={classId}
                                onChange={(val) => updateFilter('classId', val)}
                                options={selectedClassOpt.length > 0 ? selectedClassOpt : mapToOptions(initialClasses?.data)}
                                loadOptions={async (query, page) => {
                                    const res = await fetchClasses({ name: query, page, pageSize: 20 })
                                    return {
                                        options: mapToOptions(res.data),
                                        hasMore: res.currentPage < res.totalPages
                                    }
                                }}
                                placeholder="Buscar clase..."
                                hasMore={initialClasses ? initialClasses.currentPage < initialClasses.totalPages : false}
                            />

                            {/* ORDEN (Depends on Class) */}
                            {classId ? (
                                <SmartFilter
                                    key={`order-${classId}`}
                                    type="list-search"
                                    label="Orden"
                                    value={orderId}
                                    onChange={(val) => updateFilter('orderId', val)}
                                    options={selectedOrderOpt.length > 0 ? selectedOrderOpt : mapToOptions(initialOrders?.data)}
                                    loadOptions={async (query, page) => {
                                        const res = await fetchOrders({
                                            name: query,
                                            page,
                                            pageSize: 20,
                                            classId: Number(classId)
                                        })
                                        return {
                                            options: mapToOptions(res.data),
                                            hasMore: res.currentPage < res.totalPages
                                        }
                                    }}
                                    placeholder="Buscar orden..."
                                    hasMore={initialOrders ? initialOrders.currentPage < initialOrders.totalPages : false}
                                />
                            ) : (
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold tracking-wider text-slate-400">Orden</label>
                                    <p className="text-[10px] italic text-slate-400">
                                        * Seleccione una <strong>Clase</strong> primero
                                    </p>
                                </div>
                            )}

                            {/* FAMILIA (Depends on Order) */}
                            {orderId ? (
                                <SmartFilter
                                    key={`family-${orderId}`}
                                    type="list-search"
                                    label="Familia"
                                    value={familyId}
                                    onChange={(val) => updateFilter('familyId', val)}
                                    options={selectedFamilyOpt.length > 0 ? selectedFamilyOpt : mapToOptions(initialFamilies?.data)}
                                    loadOptions={async (query, page) => {
                                        const res = await fetchFamilies({
                                            name: query,
                                            page,
                                            pageSize: 20,
                                            orderId: Number(orderId)
                                        })
                                        return {
                                            options: mapToOptions(res.data),
                                            hasMore: res.currentPage < res.totalPages
                                        }
                                    }}
                                    placeholder="Buscar familia..."
                                    hasMore={initialFamilies ? initialFamilies.currentPage < initialFamilies.totalPages : false}
                                />
                            ) : (
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold tracking-wider text-slate-400">Familia</label>
                                    <p className="text-[10px] italic text-slate-400">
                                        * Seleccione un <strong>Orden</strong> primero
                                    </p>
                                </div>
                            )}

                            {/* GENERO (Depends on Family) */}
                            {familyId ? (
                                <SmartFilter
                                    key={`genus-${familyId}`}
                                    type="list-search"
                                    label="Género"
                                    value={genusId}
                                    onChange={(val) => updateFilter('genusId', val)}
                                    options={selectedGenusOpt.length > 0 ? selectedGenusOpt : mapToOptions(initialGenera?.data)}
                                    loadOptions={async (query, page) => {
                                        const res = await fetchGenera({
                                            name: query,
                                            page,
                                            pageSize: 20,
                                            familyId: Number(familyId)
                                        })
                                        return {
                                            options: mapToOptions(res.data),
                                            hasMore: res.currentPage < res.totalPages
                                        }
                                    }}
                                    placeholder="Buscar género..."
                                    hasMore={initialGenera ? initialGenera.currentPage < initialGenera.totalPages : false}
                                />
                            ) : (
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold tracking-wider text-slate-400">Género</label>
                                    <p className="text-[10px] italic text-slate-400">
                                        * Seleccione una <strong>Familia</strong> primero
                                    </p>
                                </div>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* GRUPO: Características */}
                <AccordionItem value="characteristics" className="border-b-0">
                    <AccordionTrigger className="text-sm font-semibold hover:no-underline py-2">Características</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2 px-1">
                        <SmartFilter
                            className="text-xs py-1"
                            type="check"
                            label="Con Huevos"
                            value={searchParams.get('hasEggs') === '1'}
                            onChange={(val) => updateFilter('hasEggs', val ? '1' : null)}
                        />

                        <SmartFilter
                            className="text-xs py-1"
                            type="check"
                            label="Con Imagenes"
                            value={searchParams.get('hasImages') === '1'}
                            onChange={(val) => updateFilter('hasImages', val ? '1' : null)}
                        />
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>
    )
};
