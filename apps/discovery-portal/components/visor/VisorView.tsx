'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Individual, PaginatedResponse } from '@repo/shared-types'
import { PaginationControls } from '@repo/ui'
import { useCollectionsStore } from '@/stores/useCollectionsStore'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'
import { CollectionsHeader } from '../collections/CollectionsHeader'

// Dynamically import map to avoid SSR issues with Leaflet
const VisorMap = dynamic(() => import('./VisorMap'), {
    loading: () => <div className="h-[calc(100vh-200px)] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl z-10"><Loader2 className="animate-spin" /></div>,
    ssr: false
})

interface VisorViewProps {
    data: PaginatedResponse<Individual>
}

export function VisorView({ data }: VisorViewProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { isSidebarOpen } = useCollectionsStore() // Assuming we keep the sidebar for filters

    const items = data.data || []

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', newPage.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    const handlePageSizeChange = (newSize: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('pageSize', newSize.toString())
        params.set('page', '1')
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <>
            <CollectionsHeader hiddenActions />
            <div className={`flex flex-col gap-6 transition-all duration-300 ${isSidebarOpen ? 'md:pl-0' : ''}`}>
                {/* Map Section */}
                <div className="relative w-full h-full min-h-[600px]">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[500px] bg-gray-50 dark:bg-gray-900 rounded-xl border-dashed border-2 border-gray-200 dark:border-gray-700">
                            <p className="text-muted-foreground">No se encontraron especies con las coordenadas o filtros actuales.</p>
                        </div>
                    ) : (
                        <VisorMap items={items} />
                    )}
                </div>

                {/* Pagination */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                    <PaginationControls
                        data={data}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        enableUrlSync
                    />
                </div>
            </div>
        </>
    )
}
