'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ViewToggler, ViewType } from './ViewToggler'
import { CollectionCard } from './CollectionCard'
import { ChevronDown, Download, SlidersHorizontal } from 'lucide-react'
import { Input } from '@repo/ui/components/ui/input'
import { SmartFilter } from '@repo/ui/components/ui/smart-filter'
import { Individual } from '@repo/shared-types'

interface CollectionsViewProps {
    data: Individual[]
}

export function CollectionsView({ data }: CollectionsViewProps) {
    const searchParams = useSearchParams()
    const view = (searchParams.get('view') as ViewType) || 'grid'

    return (
        <div className="flex flex-col gap-6 w-full container mx-auto">
            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4">
                {/* Kept existing logic */}
                <div className='w-full md:w-1/2'>
                    <Input placeholder="Buscar"
                        className='rounded-full w-full'
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* View Toggler and other buttons... keeping them as placeholder for brevity in this replace but fully implementing context */}
                    {/* View Toggler */}
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
                            Relevancia
                            <ChevronDown size={16} />
                        </button>
                    </div>

                    <ViewToggler />

                    <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-colors shadow-lg hover:shadow-xl">
                        <Download size={16} />
                        <span className="hidden sm:inline">Descargar</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters - DEMO */}
                <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
                    <div className='p-4 bg-white rounded-xl border border-gray-100 shadow-sm'>
                        <h3 className="font-semibold text-lg mb-4 text-gray-900 flex items-center gap-2">
                            <SlidersHorizontal size={18} />
                            Filtros
                        </h3>

                        <div className="space-y-6">
                            {/* DEMO: SmartFilter Integration */}
                            <SmartFilter
                                type="text"
                                placeholder="Buscar especie..."
                                value=""
                                onChange={() => { }}
                                debounceMs={500}
                            />

                            <SmartFilter
                                type="select"
                                label="Sexo"
                                value={null}
                                onChange={() => { }}
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
                                value={false}
                                onChange={() => { }}
                            />

                            <SmartFilter
                                type="radio"
                                label="Estado"
                                value="all"
                                onChange={() => { }}
                                options={[
                                    { label: 'Todos', value: 'all' },
                                    { label: 'Vivo', value: 'alive' },
                                    { label: 'Preservado', value: 'preserved' }
                                ]}
                            />

                            {/* Example Async Select (Mocked for Demo) */}
                            <SmartFilter
                                type="async-select"
                                label="Taxonomía (Demo Async)"
                                value={null}
                                onChange={() => { }}
                                loadOptions={async (query) => {
                                    // Mock API call
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                    return {
                                        options: [
                                            { label: 'Amphibia', value: 1 },
                                            { label: 'Reptilia', value: 2 },
                                            { label: 'Aves', value: 3 }
                                        ].filter(o => o.label.toLowerCase().includes(query.toLowerCase())),
                                        hasMore: false
                                    }
                                }}
                            />
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 min-h-[500px]">
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
                ${view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' : ''}
                ${view === 'list' ? 'flex flex-col gap-4' : ''}
                ${view === 'gallery' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4' : ''}
                ${view === 'map' ? 'h-[600px] bg-gray-100 rounded-2xl flex items-center justify-center border' : ''}
                `}>
                                {view === 'map' ? (
                                    <div className="text-gray-400 font-medium">Vista de Mapa (Próximamente)</div>
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
        </div>
    )
}
