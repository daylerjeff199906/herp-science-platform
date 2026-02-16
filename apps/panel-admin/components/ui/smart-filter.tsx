'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, Filter, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface FilterField {
  key: string
  label: string
  type: 'text' | 'select' | 'number' | 'date' | 'boolean'
  options?: { value: string | number; label: string }[]
  placeholder?: string
  asyncOptions?: {
    fetchFn: () => Promise<{ value: string | number; label: string }[]>
    dependsOn?: string
  }
}

interface SmartFilterProps {
  fields: FilterField[]
  className?: string
  onSearch?: (term: string) => void
  searchPlaceholder?: string
}

export function SmartFilter({
  fields,
  className,
  onSearch,
  searchPlaceholder = 'Buscar...',
}: SmartFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('searchTerm') || ''
  )
  const [activeFilters, setActiveFilters] = useState<
    Record<string, string | number>
  >({})
  const [asyncOptions, setAsyncOptions] = useState<
    Record<string, { value: string | number; label: string }[]>
  >({})
  const [openPopover, setOpenPopover] = useState<string | null>(null)

  useEffect(() => {
    const filters: Record<string, string | number> = {}
    fields.forEach((field) => {
      const value = searchParams.get(field.key)
      if (value) {
        filters[field.key] = field.type === 'number' ? Number(value) : value
      }
    })
    setActiveFilters(filters)
  }, [searchParams, fields])

  const loadAsyncOptions = useCallback(
    async (field: FilterField) => {
      if (!field.asyncOptions || asyncOptions[field.key]) return

      try {
        const options = await field.asyncOptions.fetchFn()
        setAsyncOptions((prev) => ({ ...prev, [field.key]: options }))
      } catch (error) {
        console.error(`Error loading options for ${field.key}:`, error)
      }
    },
    [asyncOptions]
  )

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchTerm) {
      params.set('searchTerm', searchTerm)
    } else {
      params.delete('searchTerm')
    }
    params.set('page', '1')
    router.push(`?${params.toString()}`, { scroll: false })

    if (onSearch) {
      onSearch(searchTerm)
    }
  }

  const handleFilterChange = (key: string, value: string | number | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === null || value === '' || value === undefined) {
      params.delete(key)
      setActiveFilters((prev) => {
        const newFilters = { ...prev }
        delete newFilters[key]
        return newFilters
      })
    } else {
      params.set(key, String(value))
      setActiveFilters((prev) => ({ ...prev, [key]: value }))
    }

    params.set('page', '1')
    router.push(`?${params.toString()}`, { scroll: false })
    setOpenPopover(null)
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams()
    if (searchTerm) {
      params.set('searchTerm', searchTerm)
    }
    router.push(`?${params.toString()}`, { scroll: false })
    setActiveFilters({})
  }

  const removeFilter = (key: string) => {
    handleFilterChange(key, null)
  }

  const hasActiveFilters = Object.keys(activeFilters).length > 0

  const getFieldOptions = (field: FilterField) => {
    if (field.options) return field.options
    if (asyncOptions[field.key]) return asyncOptions[field.key]
    return []
  }

  const renderFilterField = (field: FilterField) => {
    const currentValue = activeFilters[field.key]

    switch (field.type) {
      case 'text':
        return (
          <div className="space-y-2">
            <label className="text-xs font-medium">{field.label}</label>
            <Input
              type="text"
              placeholder={field.placeholder}
              value={currentValue || ''}
              onChange={(e) => handleFilterChange(field.key, e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        )

      case 'number':
        return (
          <div className="space-y-2">
            <label className="text-xs font-medium">{field.label}</label>
            <Input
              type="number"
              placeholder={field.placeholder}
              value={currentValue || ''}
              onChange={(e) =>
                handleFilterChange(
                  field.key,
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="h-8 text-xs"
            />
          </div>
        )

      case 'select': {
        const selectOptions = getFieldOptions(field)
        return (
          <div className="space-y-2">
            <label className="text-xs font-medium">{field.label}</label>
            <Select
              value={currentValue ? String(currentValue) : undefined}
              onValueChange={(value) => handleFilterChange(field.key, value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue
                  placeholder={field.placeholder || 'Seleccionar...'}
                />
              </SelectTrigger>
              <SelectContent>
                {selectOptions?.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={String(option.value)}
                    className="text-xs"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      }

      case 'boolean':
        return (
          <div className="space-y-2">
            <label className="text-xs font-medium">{field.label}</label>
            <Select
              value={
                currentValue !== undefined ? String(currentValue) : undefined
              }
              onValueChange={(value) =>
                handleFilterChange(field.key, value === '1' ? 1 : 0)
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1" className="text-xs">
                  Sí
                </SelectItem>
                <SelectItem value="0" className="text-xs">
                  No
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      case 'date':
        return (
          <div className="space-y-2">
            <label className="text-xs font-medium">{field.label}</label>
            <Input
              type="date"
              value={currentValue || ''}
              onChange={(e) => handleFilterChange(field.key, e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSearch}
            className="h-9 text-xs"
          >
            Buscar
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {fields.map((field) => (
            <Popover
              key={field.key}
              open={openPopover === field.key}
              onOpenChange={(open) => {
                setOpenPopover(open ? field.key : null)
                if (open && field.asyncOptions) {
                  loadAsyncOptions(field)
                }
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant={
                    activeFilters[field.key] !== undefined
                      ? 'default'
                      : 'outline'
                  }
                  size="sm"
                  className="h-9 text-xs gap-1"
                >
                  <Filter className="h-3 w-3" />
                  {field.label}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                {renderFilterField(field)}
              </PopoverContent>
            </Popover>
          ))}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-9 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            const field = fields.find((f) => f.key === key)
            if (!field) return null

            let displayValue = String(value)
            if (field.type === 'select' || field.type === 'boolean') {
              const fieldOptions = getFieldOptions(field)
              const option = fieldOptions?.find(
                (o) => String(o.value) === String(value)
              )
              if (option) displayValue = option.label
            }

            return (
              <Badge key={key} variant="secondary" className="text-xs gap-1">
                {field.label}: {displayValue}
                <button
                  onClick={() => removeFilter(key)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
