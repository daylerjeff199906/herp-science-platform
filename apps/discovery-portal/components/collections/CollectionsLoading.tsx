'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@repo/ui/components/ui/skeleton';
import { cn } from '@/lib/utils';

function GridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-full flex flex-col group cursor-pointer">
                    <Skeleton className="h-64 w-full rounded-xl mb-6 bg-slate-100" />
                    <div className="flex flex-col flex-grow">
                        <Skeleton className="h-7 w-3/4 mb-3 rounded-md" />
                        <Skeleton className="h-5 w-1/2 mb-6 rounded-md" />
                        <div className="space-y-2 mb-6">
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-2/3 rounded-md" />
                        </div>
                        <div className="mt-auto flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-4 w-24 rounded-md" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ListSkeleton() {
    return (
        <div className="flex flex-col space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-xl border border-gray-100">
                    <Skeleton className="w-full md:w-56 h-48 md:h-auto rounded-lg bg-gray-100" />
                    <div className="flex flex-col flex-1 gap-3 py-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div className="w-full">
                                <Skeleton className="h-3 w-20 mb-2 rounded-full" />
                                <Skeleton className="h-6 w-1/2 mb-2 rounded-md" />
                                <Skeleton className="h-4 w-1/3 rounded-md" />
                            </div>
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                            <Skeleton className="h-4 w-3/4 rounded-md" />
                            <Skeleton className="h-4 w-1/2 rounded-md" />
                            <Skeleton className="h-4 w-2/3 rounded-md" />
                            <Skeleton className="h-4 w-1/2 rounded-md" />
                        </div>
                        <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50 md:border-none">
                            <Skeleton className="h-3 w-32 rounded-md" />
                            <Skeleton className="h-4 w-24 rounded-md" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function GallerySkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
            {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="aspect-square relative overflow-hidden bg-gray-100 rounded-sm">
                    <Skeleton className="h-full w-full" />
                </div>
            ))}
        </div>
    );
}

function TableSkeleton() {
    return (
        <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4 w-24"><Skeleton className="h-4 w-12" /></th>
                            <th className="px-6 py-4"><Skeleton className="h-4 w-24" /></th>
                            <th className="px-6 py-4"><Skeleton className="h-4 w-20" /></th>
                            <th className="px-6 py-4"><Skeleton className="h-4 w-16" /></th>
                            <th className="px-6 py-4"><Skeleton className="h-4 w-24" /></th>
                            <th className="px-6 py-4"><Skeleton className="h-4 w-16" /></th>
                            <th className="px-6 py-4"><Skeleton className="h-4 w-20" /></th>
                            <th className="px-6 py-4"><Skeleton className="h-4 w-16" /></th>
                            <th className="px-6 py-4 text-center"><Skeleton className="h-4 w-8 mx-auto" /></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <tr key={i}>
                                <td className="px-6 py-3">
                                    <Skeleton className="w-16 h-16 rounded-lg" />
                                </td>
                                <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                                <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                                <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                                <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                                <td className="px-6 py-4 text-center">
                                    <Skeleton className="h-8 w-8 rounded-full mx-auto" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function CollectionsLoadingContent() {
    const searchParams = useSearchParams();
    const view = searchParams?.get('view') || 'grid';

    if (view === 'list') {
        return <ListSkeleton />;
    }

    if (view === 'gallery') {
        return <GallerySkeleton />;
    }

    if (view === 'table') {
        return <TableSkeleton />;
    }

    return <GridSkeleton />;
}

export function CollectionsLoading() {
    return (
        <Suspense fallback={<GridSkeleton />}>
            <CollectionsLoadingContent />
        </Suspense>
    );
}
