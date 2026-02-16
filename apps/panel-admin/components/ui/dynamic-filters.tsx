'use client'

import type React from 'react'
import { useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
    X,
    RotateCcw,
    SlidersHorizontal,
    Search
} from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet'

// Mock types for missing components
export type Option = {
    label: string
    value: string
    [key: string]: any
}

export type FilterType =
    | 'text'
    | 'select'
    | 'number'
    | 'multiselect'
    | 'searchable-select'
    | 'async-select'
    | 'async-multiselect'
    | 'boolean'

export interface FilterOption {
    value: string
    label: string
}

export interface FilterConfig {
    key: string
    label: string
    type: FilterType
    placeholder?: string
    options?: FilterOption[]
    defaultValue?: string | string[] | Date | number | null
    isBasic?: boolean
    description?: string
    fetcher?: (query: string) => Promise<Option[]>
    classNameSelectorContent?: string
    asyncFetcher?: (query: string, page: number) => Promise<{ options: Option[], hasMore: boolean }>
}


export type FilterValue = string | string[] | Date | number | null | undefined

export interface FilterValues {
    [key: string]: FilterValue
}

interface DynamicFiltersProps {
    filters: FilterConfig[]
    values: FilterValues
    onChange: (values: FilterValues) => void
    onApply?: (values: FilterValues) => void
    maxBasicFilters?: number
    className?: string
}

export const DynamicFilters = ({
    filters,
    values,
    onChange,
    onApply,
    maxBasicFilters = 3,
    className,
}: DynamicFiltersProps) => {
    const { basicFilters, advancedFilters } = useMemo(() => {
        const sortedFilters = [...filters].sort((a, b) => {
            if (a.isBasic && !b.isBasic) return -1;
            if (!a.isBasic && b.isBasic) return 1;
            return 0;
        });

        const basic = sortedFilters.slice(0, maxBasicFilters)
        const advanced = sortedFilters.slice(maxBasicFilters)

        return {
            basicFilters: basic,
            advancedFilters: advanced
        }
    }, [filters, maxBasicFilters])

    const activeFiltersCount = useMemo(() => {
        return Object.entries(values).filter(([key, value]) => {
            const filter = filters.find((f) => f.key === key)
            if (!filter) return false

            if (
                filter.defaultValue !== undefined &&
                JSON.stringify(value) === JSON.stringify(filter.defaultValue)
            ) {
                return false
            }

            if (value === null || value === undefined || value === '') return false
            if (Array.isArray(value)) return value.length > 0
            return true
        }).length
    }, [values, filters])

    const updateFilter = useCallback(
        (key: string, value: FilterValue) => {
            const newValues = { ...values, [key]: value }
            onChange(newValues)
        },
        [values, onChange]
    )

    const clearFilter = useCallback(
        (key: string) => {
            const newValues = { ...values, [key]: '' }
            onChange(newValues)
        },
        [values, onChange]
    )

    const clearAllFilters = useCallback(() => {
        const newValues = filters.reduce((acc, filter) => {
            acc[filter.key] = ''
            return acc
        }, {} as FilterValues)
        onChange(newValues)
    }, [filters, onChange])

    const handleApply = useCallback(() => {
        onApply?.(values)
    }, [values, onApply])

    const renderFilter = (filter: FilterConfig) => {
        const value = values[filter.key]

        const commonClasses = "rounded-full"
        const selectClasses = "w-full min-w-[200px] rounded-full"

        switch (filter.type) {
            case 'text':
                return (
                    <div key={filter.key} className="space-y-1">
                        <div className="relative">
                            <Input
                                key={filter.key}
                                onChange={(e) => updateFilter(filter.key, e.target.value)}
                                placeholder={filter.placeholder}
                                value={(value as string) || ''}
                                className={cn("pl-8", commonClasses)}
                            />
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                        <Label className="text-xs text-muted-foreground ml-1">
                            {filter.label}
                        </Label>
                    </div>
                )

            case 'number':
                return (
                    <div key={filter.key} className="space-y-1">
                        <div className="relative">
                            <Input
                                id={filter.key}
                                type="number"
                                placeholder={filter.placeholder}
                                value={(value as number) || ''}
                                onChange={(e) => updateFilter(filter.key, e.target.value)}
                                className={cn("pr-8", commonClasses)}
                            />
                            {value && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 rounded-full"
                                    onClick={() => clearFilter(filter.key)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                        <Label className="text-xs text-muted-foreground ml-1">
                            {filter.label}
                        </Label>
                    </div>
                )

            case 'select':
            case 'boolean':
                return (
                    <div key={filter.key} className="space-y-1">
                        <Select
                            value={value ? String(value) : ''}
                            onValueChange={(newValue) => updateFilter(filter.key, newValue)}
                        >
                            <SelectTrigger className={selectClasses}>
                                <SelectValue
                                    className="truncate"
                                    placeholder={filter.placeholder || 'Seleccionar...'}
                                />
                            </SelectTrigger>
                            <SelectContent className="min-w-[var(--radix-select-trigger-width)] max-w-[200px]">
                                {filter.type === 'boolean' ? (
                                    <>
                                        <SelectItem value="1">Sí</SelectItem>
                                        <SelectItem value="0">No</SelectItem>
                                    </>
                                ) : (
                                    filter.options?.map((option) => (
                                        <SelectItem key={option.value} value={String(option.value)}>
                                            {option.label}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <Label className="text-xs text-muted-foreground ml-1">
                            {filter.label}
                        </Label>
                    </div>
                )

            // Placeholder for unsupported types in this environment
            case 'multiselect':
            case 'async-select':
            case 'async-multiselect':
            case 'searchable-select':
                return (
                    <div key={filter.key} className="p-2 text-xs text-red-500 border border-red-200 rounded">
                        Componente no disponible: {filter.type}
                    </div>
                )

            default:
                return null
        }
    }

    const filtersContent = (
        <div className={cn('flex flex-col gap-4', className)}>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    {/* Render Basic Filters */}
                    {basicFilters.map(renderFilter)}

                    {/* More Filters Toggle -> Sheet */}
                    {advancedFilters.length > 0 && (
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="rounded-full mb-6" size="default">
                                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                                    Más filtros ({advancedFilters.length})
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Filtros Avanzados</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-4 mt-6">
                                    {advancedFilters.map(renderFilter)}
                                </div>
                                <div className="mt-8 pt-4 border-t flex justify-end gap-2">
                                    <Button variant="ghost" onClick={clearAllFilters} className="rounded-full">
                                        Limpiar todo
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                    {activeFiltersCount > 0 && (
                        <div className="flex items-center gap-2 pb-6">
                            <Badge variant="secondary" className="text-xs rounded-full truncate">
                                {activeFiltersCount} activo{activeFiltersCount !== 1 ? 's' : ''}
                            </Badge>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAllFilters}
                                className="text-xs rounded-full"
                            >
                                <RotateCcw className="h-3 w-3 mr-1" />
                                Limpiar
                            </Button>
                        </div>
                    )}
                    {onApply && (
                        <Button size="sm" variant="default" onClick={handleApply} className="rounded-full">
                            Aplicar ({activeFiltersCount})
                        </Button>
                    )}
                </div>
            </div>

            {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2">
                    {Object.entries(values).map(([key, value]) => {
                        const filter = filters.find((f) => f.key === key)
                        if (!filter) return null
                        if (
                            filter.defaultValue !== undefined &&
                            JSON.stringify(value) === JSON.stringify(filter.defaultValue)
                        ) {
                            return null
                        }
                        if (value === null || value === undefined || value === '')
                            return null

                        if (Array.isArray(value) && value.length === 0) return null

                        let displayValue: React.ReactNode = ''
                        if (filter.type === 'text' || filter.type === 'number') {
                            displayValue = String(value)
                        } else if (
                            filter.type === 'select' ||
                            filter.type === 'boolean'
                        ) {
                            if (filter.type === 'boolean') {
                                displayValue = value == '1' ? 'Sí' : 'No';
                            } else {
                                const option = filter.options?.find((opt) => String(opt.value) === String(value))
                                displayValue = option?.label || (typeof value === 'string' ? value : 'Seleccionado')
                            }
                        } else if (Array.isArray(value)) {
                            displayValue = `${value.length} seleccionados`
                        }

                        return (
                            <Badge key={key} variant="outline" className="text-xs rounded-full pl-3 pr-1 py-1">
                                <span className="opacity-70 mr-1">{filter.label}:</span> {displayValue}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-1 h-4 w-4 p-0 rounded-full hover:bg-neutral-200"
                                    onClick={() => clearFilter(key)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )
                    })}
                </div>
            )}
        </div>
    )

    return filtersContent
}
