'use client';

import React from 'react';
import { SmartFilter, AccordionItem, AccordionTrigger, AccordionContent } from '@repo/ui';
import { useForestTypes, fetchForestTypes, fetchForestTypeById } from '@repo/networking';
import { mapToOptions, useInitialOption } from './utils';

interface CharacteristicsSectionProps {
    searchParams: URLSearchParams;
    onUpdate: (updates: Record<string, string | null>) => void;
}

export const CharacteristicsSection: React.FC<CharacteristicsSectionProps> = ({ searchParams, onUpdate }) => {
    // === Param Access ===
    const forestTypeId = searchParams.get('forestTypeId');

    // === Data Fetching ===
    const { data: initialForestTypes } = useForestTypes({ pageSize: 20 });

    // === Options Setup (Initial + Selected) ===
    const selectedForestTypeOpt = useInitialOption(forestTypeId, (id) => fetchForestTypeById(Number(id)), 'forest-type-initial', initialForestTypes?.data);

    return (
        <AccordionItem value="characteristics" className="border-b-0">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-2">Características</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 px-1">
                <div className="flex flex-col gap-2">
                    <SmartFilter
                        className="text-xs py-1"
                        type="check"
                        label="Con Huevos"
                        value={searchParams.get('hasEggs') === '1'}
                        onChange={(val) => onUpdate({ hasEggs: val ? '1' : null })}
                    />
                    <SmartFilter
                        className="text-xs py-1"
                        type="check"
                        label="Con Imagenes"
                        value={searchParams.get('hasImages') === '1'}
                        onChange={(val) => onUpdate({ hasImages: val ? '1' : null })}
                    />
                    <SmartFilter
                        className="text-xs py-1"
                        type="check"
                        label="Con audios"
                        value={searchParams.get('hasSounds') === '1'}
                        onChange={(val) => onUpdate({ hasSounds: val ? '1' : null })}
                    />
                    <SmartFilter
                        className="text-xs py-1"
                        type="check"
                        label="Con Código Genético"
                        value={searchParams.get('barcode') === '1'}
                        onChange={(val) => onUpdate({ barcode: val ? '1' : null })}
                    />
                </div>

                <div className="pt-2 border-t border-slate-100">
                    <SmartFilter
                        type="list-search"
                        label="Tipo de Bosque"
                        value={forestTypeId}
                        onChange={(val) => onUpdate({ forestTypeId: val })}
                        options={selectedForestTypeOpt.length > 0 ? selectedForestTypeOpt : mapToOptions(initialForestTypes?.data)}
                        loadOptions={async (query, page) => {
                            const res = await fetchForestTypes({ name: query, page, pageSize: 20 });
                            return {
                                options: mapToOptions(res.data),
                                hasMore: res.currentPage < res.totalPages,
                            };
                        }}
                        placeholder="Buscar tipo de bosque..."
                        hasMore={initialForestTypes ? initialForestTypes.currentPage < initialForestTypes.totalPages : false}
                    />
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};
