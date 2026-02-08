'use client';

import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import { Accordion, Badge } from '@repo/ui';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { TaxonomySection } from './filters/TaxonomySection';
import { LocationSection } from './filters/LocationSection';
import { InstitutionSection } from './filters/InstitutionSection';
import { CharacteristicsSection } from './filters/CharacteristicsSection';

export const CollectionsFilterContent = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // --- Update Handler (Supports Multiple Updates) ---
    const updateFilters = (updates: Record<string, string | null>) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '' || value === 'all') {
                current.delete(key);
            } else {
                current.set(key, String(value));
            }
        });

        // Reset page on filter change
        current.delete('page');

        const search = current.toString();
        const query = search ? `?${search}` : "";

        if (current.toString() === searchParams.toString()) return;

        router.push(`${pathname}${query}`);
    };

    const clearAll = () => {
        router.push(pathname);
    };

    const activeCount = useMemo(() => {
        let count = 0;
        searchParams.forEach((_, key) => {
            if (key !== 'view' && key !== 'page' && key !== 'pageSize' && key !== 'searchTerm' && key !== 'orderBy' && key !== 'orderType') count++;
        });
        return count;
    }, [searchParams]);

    // Render Active Badges
    const ActiveFilters = () => {
        if (activeCount === 0) return null;

        return (
            <div className="flex flex-wrap gap-2 mb-4">
                {Array.from(searchParams.entries()).map(([key, value]) => {
                    if (['view', 'page', 'pageSize', 'orderBy', 'orderType', 'searchTerm'].includes(key)) return null;
                    // Provide readable labels? For now keep key/value or just Value
                    // To do it properly we'd need a map of labels or lookups, but keeping it simple as per original
                    return (
                        <Badge key={key} variant="secondary" className="gap-1 pl-2 pr-1 py-1 cursor-pointer hover:bg-slate-200" onClick={() => updateFilters({ [key]: null })}>
                            <span className="capitalize">{key}: {value}</span>
                            <X size={12} />
                        </Badge>
                    );
                })}
                <button onClick={clearAll} className="text-xs text-red-500 font-medium hover:underline flex items-center">
                    Borrar todos
                </button>
            </div>
        );
    };

    return (
        <div className="space-y-4 w-full">
            <ActiveFilters />

            <Accordion type="multiple" defaultValue={['taxonomy', 'location', 'characteristics', 'institutions']} className="w-full">
                {/* GRUPO: Taxonomía */}
                <TaxonomySection searchParams={searchParams} onUpdate={updateFilters} />

                {/* GRUPO: Ubicación */}
                <LocationSection searchParams={searchParams} onUpdate={updateFilters} />

                {/* GRUPO: Instituciones */}
                <InstitutionSection searchParams={searchParams} onUpdate={updateFilters} />

                {/* GRUPO: Características */}
                <CharacteristicsSection searchParams={searchParams} onUpdate={updateFilters} />
            </Accordion>
        </div>
    );
};
