'use client';
import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { PaginatedResponse } from '@repo/shared-types';

interface PaginationControlsProps {
    data: PaginatedResponse<any> | { currentPage: number; totalPages: number; totalItems: number };
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    enableUrlSync?: boolean; // If true, will try to sync with URL query params
    defaultPageSize?: number;
}

export function PaginationControls({
    data,
    onPageChange,
    onPageSizeChange,
    enableUrlSync = false,
    defaultPageSize = 10
}: PaginationControlsProps) {
    const currentPage = data.currentPage ?? 1;
    const totalPages = data.totalPages ?? 1;
    const totalItems = data.totalItems ?? 0;

    // Helper to get query param from window (client-side only)
    const getQueryParam = (key: string) => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get(key);
        }
        return null;
    };

    const pageSize = useMemo(() => {
        if (enableUrlSync) {
            const size = Number(getQueryParam('pageSize'));
            return size > 0 ? size : defaultPageSize;
        }
        return defaultPageSize;
    }, [enableUrlSync, defaultPageSize]);

    // Range calculation
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;

        if (onPageChange) {
            onPageChange(newPage);
        } else if (enableUrlSync && typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('page', newPage.toString());
            window.location.href = url.toString();
        }
    };

    const handlePageSizeChange = (newSize: string) => {
        const size = Number(newSize);
        if (onPageSizeChange) {
            onPageSizeChange(size);
        } else if (enableUrlSync && typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('pageSize', newSize);
            url.searchParams.set('page', '1');
            window.location.href = url.toString();
        }
    };

    if (totalItems === 0) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 select-none text-sm text-gray-600">
            {/* Left Side: Stats */}
            <div className="text-center sm:text-left">
                Mostrando <span className="font-medium">{startItem}</span> - <span className="font-medium">{endItem}</span> de <span className="font-medium">{totalItems}</span> resultados
                <span className="hidden sm:inline"> (Página {currentPage} de {totalPages})</span>
            </div>

            {/* Right Side: Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Page Size Selector */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 whitespace-nowrap">Filas por página</span>
                    <select
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(e.target.value)}
                        className="bg-transparent border border-gray-200 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                        {[10, 20, 50, 100].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        aria-label="Página anterior"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <span className="text-xs min-w-[3rem] text-center font-medium">
                        {currentPage} / {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        aria-label="Siguiente página"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
