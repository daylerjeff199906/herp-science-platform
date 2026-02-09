'use client'

import React, { useMemo } from 'react';
import { PanelLeftClose } from 'lucide-react';
import { Badge, Button } from '@repo/ui';
import { useSearchParams } from 'next/navigation';
import { CollectionsFilterContent } from './CollectionsFilterContent';
import { useCollectionsStore } from '@/stores/useCollectionsStore';

export const CollectionsFilters = () => {
    const searchParams = useSearchParams()
    const { toggleSidebar } = useCollectionsStore()

    const activeCount = useMemo(() => {
        let count = 0;
        searchParams.forEach((_, key) => {
            if (key !== 'view' && key !== 'page' && key !== 'pageSize' && key !== 'searchTerm') count++
        })
        return count
    }, [searchParams])

    return (
        <div className="space-y-4 px-4 pb-4">
            <div className="flex items-center justify-between mb-2 mt-2">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    Filtros
                    {activeCount > 0 && (
                        <Badge variant="default" className="bg-primary hover:bg-primary-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] ml-1">
                            {activeCount}
                        </Badge>
                    )}
                </h2>
                <Button variant="ghost" size="icon" onClick={toggleSidebar} title="Minimizar filtros">
                    <PanelLeftClose size={18} />
                </Button>
            </div>

            <div className='rounded-xl border border-gray-100 dark:border-gray-800 p-4'>
                <CollectionsFilterContent />
            </div>
        </div>
    );
};
