'use client'

import React, { useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Badge } from '@repo/ui';
import { useSearchParams } from 'next/navigation';
import { CollectionsFilterContent } from './CollectionsFilterContent';

export const CollectionsFilters = () => {
    const searchParams = useSearchParams()

    const activeCount = useMemo(() => {
        let count = 0;
        searchParams.forEach((_, key) => {
            if (key !== 'view' && key !== 'page' && key !== 'pageSize' && key !== 'searchTerm') count++
        })
        return count
    }, [searchParams])

    // --- Main Render ---
    return (
        <aside className="hidden lg:block flex-shrink-0 space-y-4">
            <div className='p-4 bg-white rounded-xl border border-gray-100 sticky top-24'>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-xs text-gray-900 flex items-center gap-2">
                        <SlidersHorizontal size={14} />
                        Filtros
                    </h3>
                    {activeCount > 0 && (
                        <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                            {activeCount}
                        </Badge>
                    )}
                </div>

                <CollectionsFilterContent />
            </div>
        </aside>
    );
};
