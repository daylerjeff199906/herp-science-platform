'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { DynamicFilters, FilterConfig, FilterValues } from '@/components/ui/dynamic-filters'
import { Sex, Activity, Museum, ForestType } from '@repo/shared-types'
import { useMemo } from 'react'

interface IndividualsFilterProps {
    sexes: Sex[]
    activities: Activity[]
    museums: Museum[]
    forestTypes: ForestType[]
}

export function IndividualsFilter({
    sexes,
    activities,
    museums,
    forestTypes,
}: IndividualsFilterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const filters: FilterConfig[] = useMemo(() => [
        {
            key: 'searchTerm',
            label: 'Buscar',
            type: 'text',
            placeholder: 'Buscar por código, especie...',
            isBasic: true,
        },
        {
            key: 'sexId',
            label: 'Sexo',
            type: 'select',
            placeholder: 'Filtrar por sexo',
            options: sexes.map((s) => ({ value: String(s.id), label: s.name })),
            isBasic: true,
        },
        {
            key: 'hasEggs',
            label: 'Huevos',
            type: 'boolean',
            placeholder: 'Filtrar por huevos',
            isBasic: true,
        },
        {
            key: 'activityId',
            label: 'Actividad',
            type: 'select',
            placeholder: 'Filtrar por actividad',
            options: activities.map((a) => ({ value: String(a.id), label: a.name })),
        },
        {
            key: 'museumId',
            label: 'Museo',
            type: 'select',
            placeholder: 'Filtrar por museo',
            options: museums.map((m) => ({ value: String(m.id), label: m.name })),
        },
        {
            key: 'forestTypeId',
            label: 'Tipo de Bosque',
            type: 'select',
            placeholder: 'Filtrar por tipo de bosque',
            options: forestTypes.map((f) => ({ value: String(f.id), label: f.name })),
        },
    ], [sexes, activities, museums, forestTypes])

    const values: FilterValues = useMemo(() => {
        const vals: FilterValues = {}
        filters.forEach((f) => {
            const val = searchParams.get(f.key)
            if (val) vals[f.key] = val
        })
        return vals
    }, [searchParams, filters])

    const handleChange = (newValues: FilterValues) => {
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(newValues).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') {
                params.delete(key)
            } else {
                params.set(key, String(value))
            }
        })

        // Reset page on filter change
        params.set('page', '1')

        router.push(`?${params.toString()}`, { scroll: false })
    }

    return (
        <DynamicFilters
            filters={filters}
            values={values}
            onChange={handleChange}
            className="pb-4"
        />
    )
}
