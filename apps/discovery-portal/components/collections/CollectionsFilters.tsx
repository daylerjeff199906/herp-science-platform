import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { SmartFilter } from '@repo/ui';

export const CollectionsFilters = () => {
    return (
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className='p-4 bg-white rounded-xl border border-gray-100 shadow-sm'>
                <h3 className="font-semibold text-lg mb-4 text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal size={18} />
                    Filtros
                </h3>

                <div className="space-y-6">
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
    );
};
