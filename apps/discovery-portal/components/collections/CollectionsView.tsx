'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ViewType } from './ViewToggler'
import { CollectionCard } from './CollectionCard'
import { CollectionTable } from './CollectionTable'
import { SlidersHorizontal } from 'lucide-react'
import { Individual, PaginatedResponse } from '@repo/shared-types'
import { CollectionsHeader } from './CollectionsHeader'
import { PaginationControls } from '@repo/ui'
import { useCollectionsLayout } from './CollectionsLayoutContext'

interface CollectionsViewProps {
    data: PaginatedResponse<Individual>
}

export function CollectionsView({ data }: CollectionsViewProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { isSidebarOpen } = useCollectionsLayout()

    // View Handling
    const rawView = searchParams.get('view')
    const view: ViewType = rawView === 'map' ? 'table' : ((rawView as ViewType) || 'grid')

    const items = data.data || [];

    // Validated Pagination handlers for Next.js routing
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
            <CollectionsHeader />
            <div className="min-h-[500px] flex flex-col gap-6">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <SlidersHorizontal className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">No se encontraron resultados</h3>
                        <p className="text-gray-500 max-w-sm mt-2">Intenta ajustar los filtros para encontrar lo que buscas.</p>
                    </div>
                ) : (
                    <>
                        {/* Pagination Controls */}
                        <div className="mb-auto border-b border-gray-100 dark:border-gray-800">
                            <PaginationControls
                                data={data}
                                onPageChange={handlePageChange}
                                onPageSizeChange={handlePageSizeChange}
                                enableUrlSync // Also enables reading initial page size from URL if logic permits
                            />
                        </div>
                        <div className={`
                            ${view === 'grid' ? (isSidebarOpen
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6')
                                : ''}
                            ${view === 'list' ? 'flex flex-col gap-4' : ''}
                            ${view === 'gallery' ? (isSidebarOpen
                                ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4'
                                : 'grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4')
                                : ''}
                        `}>
                            {view === 'table' ? (
                                <CollectionTable data={items} />
                            ) : (
                                items.map((item, idx) => (
                                    <CollectionCard key={item.id || idx} item={item} view={view === 'gallery' ? 'gallery' : view === 'list' ? 'list' : 'grid'} />
                                ))
                            )}
                        </div>

                        {/* Pagination Controls */}
                        <div className="mt-auto border-t border-gray-100 dark:border-gray-800">
                            <PaginationControls
                                data={data}
                                onPageChange={handlePageChange}
                                onPageSizeChange={handlePageSizeChange}
                                enableUrlSync // Also enables reading initial page size from URL if logic permits
                            />
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
