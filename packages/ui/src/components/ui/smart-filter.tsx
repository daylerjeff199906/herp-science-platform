"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"
import { Input } from "./input"
import { Switch } from "./switch"
import { Checkbox } from "./checkbox"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button" // Assuming Button exists or I should check. Using html button if not? Button was in list_dir output!
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./command"

// --- Types ---

export type SmartFilterType = 'text' | 'switch' | 'check' | 'radio' | 'select' | 'async-select' | 'date-range'

export interface SmartFilterOption {
    label: string
    value: string | number
}

export interface SmartFilterProps {
    type: SmartFilterType
    label?: string
    value?: any
    onChange: (value: any) => void
    options?: SmartFilterOption[]
    loadOptions?: (query: string, page: number) => Promise<{ options: SmartFilterOption[], hasMore: boolean }>
    placeholder?: string
    className?: string
    debounceMs?: number
}

// --- Hook: Debounce ---
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState(value);
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

// --- Components ---

// 1. Text Search Filter
const TextFilter = ({ value, onChange, placeholder, debounceMs = 300, className }: SmartFilterProps) => {
    const [localValue, setLocalValue] = React.useState(value || '')
    const debouncedValue = useDebounce(localValue, debounceMs)

    React.useEffect(() => {
        onChange(debouncedValue)
    }, [debouncedValue])

    return (
        <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder={placeholder || "Buscar..."}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className={cn(
                    "pl-9 rounded-lg bg-slate-50 border-slate-200 focus:bg-white transition-colors",
                    className
                )}
            />
        </div>
    )
}

// 2. Switch Filter
const SwitchFilter = ({ label, value, onChange, className }: SmartFilterProps) => {
    return (
        <div className={cn("flex items-center justify-between py-2", className)}>
            <label className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700">
                {label}
            </label>
            <Switch
                checked={!!value}
                onCheckedChange={onChange}
            />
        </div>
    )
}

// 2.5 Checkbox Filter
const CheckboxFilter = ({ label, value, onChange, className }: SmartFilterProps) => {
    return (
        <div className={cn("flex items-center space-x-2 py-2", className)}>
            <Checkbox
                id={`chk-${label}`}
                checked={!!value}
                onCheckedChange={(checked) => onChange(checked)}
            />
            <label
                htmlFor={`chk-${label}`}
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 cursor-pointer"
            >
                {label}
            </label>
        </div>
    )
}

// 3. Radio Filter
const RadioFilter = ({ label, value, onChange, options, className }: SmartFilterProps) => {
    return (
        <div className={cn("space-y-3", className)}>
            {label && <h4 className="font-medium text-slate-900">{label}</h4>}
            <RadioGroup value={String(value)} onValueChange={onChange} className="gap-2">
                {options?.map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={String(opt.value)} id={`r-${opt.value}`} />
                        <label htmlFor={`r-${opt.value}`} className="text-slate-600 cursor-pointer">
                            {opt.label}
                        </label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    )
}

// 4. Async/Sync Select Filter
const SelectFilter = ({
    label,
    value,
    onChange,
    options: initialOptions = [],
    loadOptions,
    type,
    placeholder,
    className
}: SmartFilterProps) => {
    const [open, setOpen] = React.useState(false)
    const [options, setOptions] = React.useState<SmartFilterOption[]>(initialOptions)
    const [loading, setLoading] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const debouncedSearch = useDebounce(search, 300)
    const [page, setPage] = React.useState(1)
    const [hasMore, setHasMore] = React.useState(true)

    const isAsync = type === 'async-select'

    // Load initial options or react to search for Async
    React.useEffect(() => {
        if (!isAsync) return

        let active = true
        const fetchOptions = async () => {
            setLoading(true)
            try {
                // Reset page on search change
                const p = 1
                if (loadOptions) {
                    const res = await loadOptions(debouncedSearch, p)
                    if (active) {
                        setOptions(res.options)
                        setHasMore(res.hasMore)
                        setPage(p)
                    }
                }
            } catch (error) {
                console.error("Error loading options", error)
            } finally {
                if (active) setLoading(false)
            }
        }

        fetchOptions()

        return () => { active = false }
    }, [debouncedSearch, isAsync]) // Removed loadOptions dependency to avoid loop if not stable

    // Handle selection display
    const selectedOption = options.find(opt => String(opt.value) === String(value))

    // Fallback display if selected value exists but isn't in current options list (common in async)
    const displayValue = selectedOption?.label || (value ? `Seleccionado: ${value}` : (placeholder || "Seleccionar..."))

    return (
        <div className="flex flex-col gap-1.5">
            {label && <label className="text-xs font-semibold tracking-wider text-slate-500">{label}</label>}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer hover:bg-slate-50 transition-colors",
                            className
                        )}
                        onClick={() => setOpen(!open)}
                    >
                        <span className={cn("truncate", !value && "text-muted-foreground")}>
                            {displayValue}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command shouldFilter={!isAsync}>
                        <CommandInput
                            placeholder={isAsync ? "Buscar en servidor..." : "Buscar..."}
                            value={search}
                            onValueChange={setSearch}
                        />
                        <CommandList>
                            <CommandEmpty>{loading ? 'Cargando...' : 'No se encontraron resultados.'}</CommandEmpty>
                            {/* Loading Indicator inside list */}
                            {loading && <div className="p-2 text-xs text-center text-muted-foreground">Cargando...</div>}

                            <CommandGroup>
                                {/* Clear Opotion */}
                                {value && (
                                    <CommandItem
                                        value="_clear_selection_"
                                        onSelect={() => {
                                            onChange(undefined)
                                            setOpen(false)
                                        }}
                                        className="text-red-500 font-medium"
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Limpiar selección
                                    </CommandItem>
                                )}

                                {options.map((opt) => (
                                    <CommandItem
                                        key={`${opt.value}-${opt.label}`}
                                        value={opt.label} // syncing command value to label for search cmdk default behavior
                                        onSelect={() => {
                                            onChange(opt.value === value ? undefined : opt.value)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                String(value) === String(opt.value) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {opt.label}
                                    </CommandItem>
                                ))}

                                {isAsync && hasMore && !loading && (
                                    <CommandItem value="_load_more" disabled className="justify-center text-muted-foreground italic text-xs">
                                        Escribe para buscar más...
                                    </CommandItem>
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}


// --- Main Export ---

export function SmartFilter(props: SmartFilterProps) {
    const { type } = props

    switch (type) {
        case 'text':
            return <TextFilter {...props} />
        case 'switch':
            return <SwitchFilter {...props} />
        case 'check':
            return <CheckboxFilter {...props} />
        case 'radio':
            return <RadioFilter {...props} />
        case 'select':
        case 'async-select':
            return <SelectFilter {...props} />
        default:
            return null
    }
}
