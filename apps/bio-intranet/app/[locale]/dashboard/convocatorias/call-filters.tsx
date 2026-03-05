'use client';

import { useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CallFiltersProps {
    years: string[];
    locale: string;
}

export function CallFilters({ years, locale }: CallFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const status = searchParams.get('status') || 'active';
    const year = searchParams.get('year') || '';

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all' && value !== '') {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        // Always default to active if no status is set explicitly
        if (!params.has('status') && key !== 'status' && status === 'active') {
            // keep implicit active
        }

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    const clearFilters = () => {
        startTransition(() => {
            router.push(pathname);
        });
    };

    const hasActiveFilters = searchParams.has('status') || searchParams.has('year');

    return (
        <div className="flex flex-wrap gap-4 items-center">
            <div className="flex flex-col gap-1.5 min-w-[160px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Estado</span>
                <Select
                    value={status}
                    onValueChange={(val: string) => updateFilters('status', val)}
                    disabled={isPending}
                >
                    <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border shadow-none">
                        <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Activas</SelectItem>
                        <SelectItem value="past">Pasadas</SelectItem>
                        <SelectItem value="all">Todas</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-1.5 min-w-[140px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Año</span>
                <Select
                    value={year}
                    onValueChange={(val: string) => updateFilters('year', val)}
                    disabled={isPending}
                >
                    <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border shadow-none">
                        <SelectValue placeholder="Todos los años" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los años</SelectItem>
                        {years.map((y) => (
                            <SelectItem key={y} value={y}>
                                {y}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {hasActiveFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    disabled={isPending}
                    className="mt-5 h-10 px-3 rounded-xl text-xs font-bold uppercase text-muted-foreground hover:text-foreground"
                >
                    <X className="w-3.5 h-3.5 mr-1.5" />
                    Limpiar
                </Button>
            )}
        </div>
    );
}
