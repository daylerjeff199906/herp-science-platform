'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    SortingState,
    ColumnDef,
    flexRender,
} from '@tanstack/react-table';
import { Eye, Power, Trash2, FileImage, Edit } from 'lucide-react';
import { Individual } from '@repo/shared-types';
import { Button } from '@/components/ui/button';
import {

    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ROUTES } from '@/config';
import { cn } from '@/lib/utils';

interface IndividualsTableProps {
    data: Individual[];
    onEdit: (individual: Individual) => void;
    onStatusChange: (individual: Individual) => void;
    onDelete: (individual: Individual) => void;
}

export function IndividualsTable({
    data,
    onEdit,
    onStatusChange,
    onDelete,
}: IndividualsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const columns: ColumnDef<Individual>[] = [
        {
            accessorKey: 'code',
            header: 'Código',
            cell: ({ row }) => (
                <span className="font-mono text-xs">{row.getValue('code') || '-'}</span>
            ),
        },
        {
            accessorKey: 'species.scientificName',
            header: 'Especie',
            cell: ({ row }) => {
                const species = row.original.species;
                return (
                    <div className="flex flex-col">
                        <span className="font-medium text-xs">{species.scientificName}</span>
                        {species.commonName && (
                            <span className="text-xs text-muted-foreground">{species.commonName}</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'sex.name',
            header: 'Sexo',
            cell: ({ row }) => (
                <span className="text-xs">{row.original.sex?.name || '-'}</span>
            ),
        },
        {
            accessorKey: 'identDate',
            header: 'Fecha',
            cell: ({ row }) => (
                <span className="text-xs">{row.getValue('identDate')}</span>
            ),
        },
        {
            accessorKey: 'weight',
            header: 'Peso',
            cell: ({ row }) => (
                <span className="text-xs">{row.getValue('weight') ? `${row.getValue('weight')}g` : '-'}</span>
            ),
        },
        {
            accessorKey: 'svl',
            header: 'LC',
            cell: ({ row }) => (
                <span className="text-xs">{row.getValue('svl') ? `${row.getValue('svl')}mm` : '-'}</span>
            ),
        },
        {
            accessorKey: 'hasEggs',
            header: 'Huevos',
            cell: ({ row }) => (
                <span className={cn(
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                    row.getValue('hasEggs')
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                )}>
                    {row.getValue('hasEggs') ? 'Sí' : 'No'}
                </span>
            ),
        },
        {
            accessorKey: 'files.images',
            header: 'Imágenes',
            cell: ({ row }) => {
                const imageCount = row.original.files?.images?.length || 0;
                return (
                    <div className="flex items-center gap-1">
                        <FileImage className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{imageCount}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'status',
            header: 'Estado',
            cell: ({ row }) => (
                <span className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                    row.getValue('status') === 1
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                )}>
                    {row.getValue('status') === 1 ? 'Activo' : 'Inactivo'}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const individual = row.original;
                return (
                    <div className="flex items-center justify-end gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            asChild
                        >
                            <Link href={`${ROUTES.CORE.INDIVIDUALS}/${individual.id}`}>
                                <Eye className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onEdit(individual)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onStatusChange(individual)}
                        >
                            <Power className={cn(
                                'h-4 w-4',
                                individual.status === 1 ? 'text-green-600' : 'text-gray-400'
                            )} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:text-destructive"
                            onClick={() => onDelete(individual)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="rounded-md border bg-card text-card-foreground rounded-lg">
            <div className="relative max-h-[600px] overflow-auto rounded-lg">
                <table className="w-full caption-bottom text-sm">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="sticky top-0 z-20 h-10 px-3 py-2 text-left align-middle font-medium text-muted-foreground text-xs bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/60"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-3 py-2 align-middle">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground text-xs"
                                >
                                    No se encontraron resultados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </table>
            </div>
        </div>
    );
}
