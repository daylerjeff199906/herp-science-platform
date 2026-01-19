'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ICountry } from '@/types';
import { CountriesFilter } from './countries-filter';
import { CountriesTable } from './countries-table';
import { CountriesSheet } from './countries-sheet';

interface CountriesViewProps {
    countries: ICountry[];
}

export function CountriesView({ countries }: CountriesViewProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);

    const handleAdd = () => {
        setSelectedCountry(null);
        setIsSheetOpen(true);
    };

    const handleEdit = (country: ICountry) => {
        setSelectedCountry(country);
        setIsSheetOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end justify-between">
                <CountriesFilter />
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo País
                </Button>
            </div>

            <CountriesTable data={countries} onEdit={handleEdit} />

            <CountriesSheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                country={selectedCountry}
            />
        </div>
    );
}
