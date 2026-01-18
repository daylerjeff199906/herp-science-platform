'use client';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { CountriesForm } from './countries-form';
import { ICountry } from '@/types';

interface CountriesSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    country: ICountry | null;
}

export function CountriesSheet({ open, onOpenChange, country }: CountriesSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{country ? 'Editar País' : 'Nuevo País'}</SheetTitle>
                    <SheetDescription>
                        {country
                            ? 'Realice los cambios necesarios en el país seleccionado.'
                            : 'Complete el formulario para crear un nuevo país.'}
                    </SheetDescription>
                </SheetHeader>
                <CountriesForm
                    initialData={country}
                    onSuccess={() => onOpenChange(false)}
                />
            </SheetContent>
        </Sheet>
    );
}
