'use client';

import React from 'react';
import { SmartFilter, AccordionItem, AccordionTrigger, AccordionContent } from '@repo/ui';
import {
    useInstitutions,
    fetchInstitutions,
    fetchInstitutionById,
    useMuseums,
    fetchMuseums,
    fetchMuseumById,
} from '@repo/networking';
import { useQuery } from '@tanstack/react-query';
import { mapToOptions, useInitialOption } from './utils';

/**
 * InstitutionSection handles:
 * Institution -> Museum
 */
interface InstitutionSectionProps {
    searchParams: URLSearchParams;
    onUpdate: (updates: Record<string, string | null>) => void;
}

export const InstitutionSection: React.FC<InstitutionSectionProps> = ({ searchParams, onUpdate }) => {
    // === Param Access ===
    const institutionId = searchParams.get('institutionId');
    const museumId = searchParams.get('museumId');

    // === Data Fetching Initial Lists ===
    const { data: initialInstitutions } = useInstitutions({ pageSize: 20 });

    const { data: initialMuseums } = useQuery({
        queryKey: ['museums-initial', institutionId],
        queryFn: () => fetchMuseums({ pageSize: 20, institution_id: institutionId || undefined }),
        enabled: !!institutionId,
    });

    // === Options Setup (Initial + Selected) ===
    const selectedInstitutionOpt = useInitialOption(institutionId, (id) => fetchInstitutionById(id), 'institution-initial', initialInstitutions?.data);
    const selectedMuseumOpt = useInitialOption(museumId, (id) => fetchMuseumById(id), 'museum-initial', initialMuseums?.data);

    // === Handlers (Cascade Logic) ===
    const handleInstitutionChange = (val: string | null) => {
        onUpdate({
            institutionId: val,
            museumId: null,
        });
    };

    const handleMuseumChange = (val: string | null) => {
        onUpdate({
            museumId: val,
        });
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
        <AccordionItem value="institutions" className="border-b-0">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-2">Instituciones</AccordionTrigger>
            <AccordionContent className="pt-2 px-1 flex flex-col gap-4 lg:gap-6">
                <div className="flex flex-col gap-2">
                    {/* INSTITUTION */}
                    <SmartFilter
                        type="list-search"
                        label="Institución"
                        value={institutionId}
                        onChange={handleInstitutionChange}
                        options={selectedInstitutionOpt.length > 0 ? selectedInstitutionOpt : mapToOptions(initialInstitutions?.data)}
                        loadOptions={async (query, page) => {
                            const res = await fetchInstitutions({ name: query, page, pageSize: 20 });
                            return {
                                options: mapToOptions(res.data),
                                hasMore: res.currentPage < res.totalPages,
                            };
                        }}
                        placeholder="Buscar institución..."
                        hasMore={initialInstitutions ? initialInstitutions.currentPage < initialInstitutions.totalPages : false}
                    />

                    {/* MUSEUM */}
                    {institutionId ? (
                        <SmartFilter
                            key={`museum-${institutionId}`}
                            type="list-search"
                            label="Museo"
                            value={museumId}
                            onChange={handleMuseumChange}
                            options={selectedMuseumOpt.length > 0 ? selectedMuseumOpt : mapToOptions(initialMuseums?.data)}
                            loadOptions={async (query, page) => {
                                const res = await fetchMuseums({
                                    searchTerm: query,
                                    page,
                                    pageSize: 20,
                                    institution_id: institutionId,
                                });
                                return {
                                    options: mapToOptions(res.data),
                                    hasMore: res.currentPage < res.totalPages,
                                };
                            }}
                            placeholder="Buscar museo..."
                            hasMore={
                                initialMuseums ? initialMuseums.currentPage < initialMuseums.totalPages : false
                            }
                        />
                    ) : (
                        <DisabledFilterHint label="Museo" parentLabel="una Institución" />
                    )}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};
