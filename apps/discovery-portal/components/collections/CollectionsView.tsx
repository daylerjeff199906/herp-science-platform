'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ViewToggler, ViewType } from './ViewToggler'
import { CollectionCard } from './CollectionCard'
import { ChevronDown, Download, SlidersHorizontal } from 'lucide-react'

// Placeholder interface
interface PaginationMeta {
    itemCount: number
    totalItems: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
}

interface CollectionsViewProps {
    data: {
        items: any[]
        meta: PaginationMeta
    }
}

export function CollectionsView({ data }: CollectionsViewProps) {
    const searchParams = useSearchParams()
    const view = (searchParams.get('view') as ViewType) || 'grid'

    // Placeholder sort handler
    const handleSort = (value: string) => {
        // Implement sort logic using URLSearchParams
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Resultados
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {data.meta?.totalItems || 0} especímenes encontrados
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Sort Dropdown Placeholder */}
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
                            Relevancia
                            <ChevronDown size={16} />
                        </button>
                    </div>

                    {/* View Toggler */}
                    <ViewToggler />

                    {/* Download Button */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-colors shadow-lg hover:shadow-xl">
                        <Download size={16} />
                        <span className="hidden sm:inline">Descargar</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full min-h-[500px]">
                {data.items.length === 0 ? (
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
              ${view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : ''}
              ${view === 'list' ? 'flex flex-col gap-4' : ''}
              ${view === 'gallery' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4' : ''}
              ${view === 'map' ? 'h-[600px] bg-gray-100 rounded-2xl flex items-center justify-center border' : ''}
            `}>
                            {view === 'map' ? (
                                <div className="text-gray-400 font-medium">Vista de Mapa (Próximamente)</div>
                            ) : (
                                data.items.map((item: any, idx: number) => (
                                    <CollectionCard key={item.id || idx} item={item} view={view === 'gallery' ? 'gallery' : view === 'list' ? 'list' : 'grid'} />
                                ))
                            )}
                        </div>

                        {/* Simpler Pagination (Previous/Next) from current structure */}
                        {data.meta && (
                            <div className="flex justify-center mt-12 gap-2">
                                {/* Logic would be implemented here to show page numbers */}
                                <span className="text-sm text-gray-500">Página {data.meta.currentPage} de {data.meta.totalPages}</span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
