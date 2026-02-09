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

    return (
        <aside className="hidden lg:block flex-shrink-0 space-y-4">
            <div className='p-4 rounded-xl border border-gray-100 sticky top-24'>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-xs text-gray-900 flex items-center gap-2">
                        <div className="flex items-center gap-2 relative">
                            {activeCount > 0 && (
                                <Badge variant="default" className="bg-primary hover:bg-primary-600 rounded-full w-5 h-5.5 flex items-center justify-center absolute -top-4 -right-4 text-[10px]">
                                    {activeCount}
                                </Badge>
                            )}
                            <SlidersHorizontal size={14} />
                        </div>
                        {activeCount > 0 ? (
                            <span className="text-xs text-gray-500 pl-3">Filtros</span>
                        ) : (
                            <span className="text-xs text-gray-500">Filtros</span>
                        )}
                    </h3>
                </div>
                <CollectionsFilterContent />
            </div>
        </aside>
    );
};
