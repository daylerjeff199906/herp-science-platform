'use client'
import { useSearchParams } from 'next/navigation'
import { ViewType } from './ViewToggler'
import { CollectionCard } from './CollectionCard'
import { CollectionTable } from './CollectionTable'
import { SlidersHorizontal } from 'lucide-react'
import { Individual } from '@repo/shared-types'
import { CollectionsHeader } from './CollectionsHeader'

interface CollectionsViewProps {
    data: Individual[]
}

export function CollectionsView({ data }: CollectionsViewProps) {
    const searchParams = useSearchParams()
    const rawView = searchParams.get('view')
    const view = rawView === 'map' ? 'table' : ((rawView as ViewType) || 'grid')

    return (
        <div className="flex flex-col gap-6 w-full container mx-auto">
            {/* Header / Toolbar */}
            {/* Header / Toolbar */}
            <CollectionsHeader />
            {/* Main Content Area */}
            <div className="min-h-[500px]">
                {data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <SlidersHorizontal className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">No se encontraron resultados</h3>
                        <p className="text-gray-500 max-w-sm mt-2">Intenta ajustar los filtros para encontrar lo que buscas.</p>
                    </div>
                ) : (
                    <>
                        {/* Grid/Layout Rendering */}
                        <div className={`
                ${view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-6' : ''}
                ${view === 'list' ? 'flex flex-col gap-4' : ''}
                ${view === 'gallery' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4' : ''}
                `}>
                            {view === 'table' ? (
                                <CollectionTable data={data} />
                            ) : (
                                data.map((item, idx) => (
                                    <CollectionCard key={item.id || idx} item={item} view={view === 'gallery' ? 'gallery' : view === 'list' ? 'list' : 'grid'} />
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
