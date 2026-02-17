'use client'

import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface TableLoadingProps {
  rows?: number
  columns?: number
  className?: string
  showHeader?: boolean
  showPagination?: boolean
  showFilters?: boolean
}

export function TableLoading({
  rows = 5,
  columns = 5,
  className,
  showHeader = true,
  showPagination = true,
  showFilters = true,
}: TableLoadingProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header y filtros */}
      {showHeader && (
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>

          {showFilters && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex gap-2 flex-1">
                <Skeleton className="h-9 w-full max-w-sm" />
                <Skeleton className="h-9 w-20" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabla */}
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <div className="relative max-h-[600px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/60">
              <TableRow>
                {Array.from({ length: columns }).map((_, index) => (
                  <TableHead
                    key={index}
                    className="h-10 px-3 py-2 text-left align-middle"
                  >
                    <Skeleton className="h-3 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="border-b">
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className="px-3 py-3 align-middle"
                    >
                      <Skeleton
                        className={cn(
                          'h-3',
                          colIndex === 0
                            ? 'w-24'
                            : colIndex === columns - 1
                              ? 'w-32'
                              : 'w-full'
                        )}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Paginación */}
      {showPagination && (
        <div className="flex items-center justify-between px-2">
          <Skeleton className="h-3 w-48" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <div className="flex items-center gap-1 px-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      )}
    </div>
  )
}

// Variante compacta para tablas pequeñas
export function TableLoadingCompact({
  rows = 3,
  columns = 4,
  className,
}: Omit<TableLoadingProps, 'showHeader' | 'showPagination' | 'showFilters'>) {
  return (
    <div className={cn('rounded-md border', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index} className="h-10">
                <Skeleton className="h-3 w-16" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex} className="py-3">
                  <Skeleton className="h-3 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// Variante solo filas (sin header)
export function TableRowsLoading({
  rows = 5,
  columns = 5,
  className,
}: Omit<TableLoadingProps, 'showHeader' | 'showPagination' | 'showFilters'>) {
  return (
    <div className={className}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-4 py-3 border-b last:border-0"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn(
                'h-3',
                colIndex === columns - 1 ? 'w-24 ml-auto' : 'flex-1'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
