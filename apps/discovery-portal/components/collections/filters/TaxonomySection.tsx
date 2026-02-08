'use client';

import React from 'react';
import { SmartFilter, AccordionItem, AccordionTrigger, AccordionContent } from '@repo/ui';
import {
    useClasses,
    useSexes,
    fetchSexes,
    fetchClasses,
    fetchClassById,
    fetchOrders,
    fetchOrderById,
    fetchFamilies,
    fetchFamilyById,
    fetchGenera,
    fetchGenusById,
    fetchSpecies,
    fetchSpeciesById,
} from '@repo/networking';
import { useQuery } from '@tanstack/react-query';
import { mapToOptions, useInitialOption } from './utils';

interface TaxonomySectionProps {
    searchParams: URLSearchParams;
    onUpdate: (updates: Record<string, string | null>) => void;
}

export const TaxonomySection: React.FC<TaxonomySectionProps> = ({ searchParams, onUpdate }) => {
    // === Param Access ===
    const classId = searchParams.get('classId');
    const orderId = searchParams.get('orderId');
    const familyId = searchParams.get('familyId');
    const genusId = searchParams.get('genusId');
    const speciesId = searchParams.get('speciesId');
    const sexId = searchParams.get('sexId');

    // === Data Fetching Initial Lists ===
    const { data: sexes } = useSexes({ pageSize: 100 });
    const { data: initialClasses } = useClasses({ pageSize: 20 });

    const { data: initialOrders } = useQuery({
        queryKey: ['orders-initial', classId],
        queryFn: () => fetchOrders({ pageSize: 20, classId: classId ? Number(classId) : undefined }),
        enabled: !!classId,
    });

    const { data: initialFamilies } = useQuery({
        queryKey: ['families-initial', orderId],
        queryFn: () => fetchFamilies({ pageSize: 20, orderId: orderId ? Number(orderId) : undefined }),
        enabled: !!orderId,
    });

    const { data: initialGenera } = useQuery({
        queryKey: ['genera-initial', familyId],
        queryFn: () => fetchGenera({ pageSize: 20, familyId: familyId ? Number(familyId) : undefined }),
        enabled: !!familyId,
    });

    const { data: initialSpecies } = useQuery({
        queryKey: ['species-initial', genusId],
        queryFn: () => fetchSpecies({ pageSize: 20, genusId: genusId ? genusId : '', searchTerm: '' }),
        enabled: !!genusId,
    });

    // === Options Setup ===
    const sexOptions = React.useMemo(() => {
        if (!sexes?.data) return [];
        return mapToOptions(sexes.data);
    }, [sexes]);

    const selectedClassOpt = useInitialOption(classId, (id) => fetchClassById(Number(id)), 'class-initial', initialClasses?.data);
    const selectedOrderOpt = useInitialOption(orderId, (id) => fetchOrderById(Number(id)), 'order-initial', initialOrders?.data);
    const selectedFamilyOpt = useInitialOption(familyId, (id) => fetchFamilyById(Number(id)), 'family-initial', initialFamilies?.data);
    const selectedGenusOpt = useInitialOption(genusId, (id) => fetchGenusById(Number(id)), 'genus-initial', initialGenera?.data);
    const selectedSpeciesOpt = useInitialOption(speciesId, (id) => fetchSpeciesById(Number(id)), 'species-initial', initialSpecies?.data, 'scientificName');

    // === Handlers ===
    const handleClassChange = (val: string | null) => {
        onUpdate({
            classId: val,
            orderId: null,
            familyId: null,
            genusId: null,
            speciesId: null,
        });
    };

    const handleOrderChange = (val: string | null) => {
        onUpdate({
            orderId: val,
            familyId: null,
            genusId: null,
            speciesId: null,
        });
    };

    const handleFamilyChange = (val: string | null) => {
        onUpdate({
            familyId: val,
            genusId: null,
            speciesId: null,
        });
    };

    const handleGenusChange = (val: string | null) => {
        onUpdate({
            genusId: val,
            speciesId: null
        });
    };

    const handleSpeciesChange = (val: string | null) => {
        onUpdate({ speciesId: val });
    };

    const handleSexChange = (val: string | null) => {
        onUpdate({ sexId: val });
    };

    // Helper to render disabled inputs with hint
    const DisabledFilterHint = ({ label, parentLabel }: { label: string; parentLabel: string }) => (
        <div className="space-y-1">
            <label className="text-xs font-semibold tracking-wider text-slate-400">{label}</label>
            <p className="text-[10px] italic text-slate-400">
                * Seleccione {parentLabel} primero
            </p>
        </div>
    );

    return (
        <AccordionItem value="taxonomy" className="border-b-0">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-2">Taxonomía</AccordionTrigger>
            <AccordionContent className="pt-2 px-1 flex flex-col gap-4 lg:gap-6">
                <div className="flex flex-col gap-2">
                    {/* SEXO */}
                    <SmartFilter
                        type="async-select"
                        label="Sexo"
                        value={sexId}
                        onChange={handleSexChange}
                        options={sexOptions}
                        loadOptions={async (query, page) => {
                            const res = await fetchSexes({ name: query, page, pageSize: 20 });
                            return {
                                options: mapToOptions(res.data),
                                hasMore: res.currentPage < res.totalPages,
                            };
                        }}
                        placeholder="Buscar sexo..."
                        hasMore={sexes ? sexes.currentPage < sexes.totalPages : false}
                    />

                    {/* CLASE */}
                    <SmartFilter
                        type="list-search"
                        label="Clase"
                        value={classId}
                        onChange={handleClassChange}
                        options={selectedClassOpt.length > 0 ? selectedClassOpt : mapToOptions(initialClasses?.data)}
                        loadOptions={async (query, page) => {
                            const res = await fetchClasses({ name: query, page, pageSize: 20 });
                            return {
                                options: mapToOptions(res.data),
                                hasMore: res.currentPage < res.totalPages,
                            };
                        }}
                        placeholder="Buscar clase..."
                        hasMore={initialClasses ? initialClasses.currentPage < initialClasses.totalPages : false}
                    />

                    {/* ORDEN */}
                    {classId ? (
                        <SmartFilter
                            key={`order-${classId}`}
                            type="list-search"
                            label="Orden"
                            value={orderId}
                            onChange={handleOrderChange}
                            options={selectedOrderOpt.length > 0 ? selectedOrderOpt : mapToOptions(initialOrders?.data)}
                            loadOptions={async (query, page) => {
                                const res = await fetchOrders({
                                    name: query,
                                    page,
                                    pageSize: 20,
                                    classId: Number(classId),
                                });
                                return {
                                    options: mapToOptions(res.data),
                                    hasMore: res.currentPage < res.totalPages,
                                };
                            }}
                            placeholder="Buscar orden..."
                            hasMore={initialOrders ? initialOrders.currentPage < initialOrders.totalPages : false}
                        />
                    ) : (
                        <DisabledFilterHint label="Orden" parentLabel="una Clase" />
                    )}

                    {/* FAMILIA */}
                    {orderId ? (
                        <SmartFilter
                            key={`family-${orderId}`}
                            type="list-search"
                            label="Familia"
                            value={familyId}
                            onChange={handleFamilyChange}
                            options={selectedFamilyOpt.length > 0 ? selectedFamilyOpt : mapToOptions(initialFamilies?.data)}
                            loadOptions={async (query, page) => {
                                const res = await fetchFamilies({
                                    name: query,
                                    page,
                                    pageSize: 20,
                                    orderId: Number(orderId),
                                });
                                return {
                                    options: mapToOptions(res.data),
                                    hasMore: res.currentPage < res.totalPages,
                                };
                            }}
                            placeholder="Buscar familia..."
                            hasMore={
                                initialFamilies ? initialFamilies.currentPage < initialFamilies.totalPages : false
                            }
                        />
                    ) : (
                        <DisabledFilterHint label="Familia" parentLabel="un Orden" />
                    )}

                    {/* GENERO */}
                    {familyId ? (
                        <SmartFilter
                            key={`genus-${familyId}`}
                            type="list-search"
                            label="Género"
                            value={genusId}
                            onChange={(val) => {
                                handleGenusChange(val);
                                onUpdate({ speciesId: null });
                            }}
                            options={selectedGenusOpt.length > 0 ? selectedGenusOpt : mapToOptions(initialGenera?.data)}
                            loadOptions={async (query, page) => {
                                const res = await fetchGenera({
                                    name: query,
                                    page,
                                    pageSize: 20,
                                    familyId: Number(familyId),
                                });
                                return {
                                    options: mapToOptions(res.data),
                                    hasMore: res.currentPage < res.totalPages,
                                };
                            }}
                            placeholder="Buscar género..."
                            hasMore={initialGenera ? initialGenera.currentPage < initialGenera.totalPages : false}
                        />
                    ) : (
                        <DisabledFilterHint label="Género" parentLabel="una Familia" />
                    )}

                    {/* ESPECIE */}
                    <SmartFilter
                        key={`species-${genusId}`}
                        type="list-search"
                        label="Especie"
                        value={speciesId}
                        onChange={handleSpeciesChange}
                        options={selectedSpeciesOpt.length > 0 ? selectedSpeciesOpt : mapToOptions(initialSpecies?.data, 'scientificName')}
                        loadOptions={async (query, page) => {
                            const res = await fetchSpecies({
                                searchTerm: query,
                                page,
                                pageSize: 20,
                                genusId: genusId || undefined,
                            });
                            return {
                                options: mapToOptions(res.data, 'scientificName'),
                                hasMore: res.currentPage < res.totalPages,
                            };
                        }}
                        placeholder="Buscar especie..."
                        hasMore={initialSpecies ? initialSpecies.currentPage < initialSpecies.totalPages : false}
                    />
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};
