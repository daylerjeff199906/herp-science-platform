'use client';

import { ICountry } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface CountriesTableProps {
    data: ICountry[];
    onEdit: (country: ICountry) => void;
}

export function CountriesTable({ data, onEdit }: CountriesTableProps) {
    return (
        <div className="rounded-md border bg-card text-card-foreground shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="border-b bg-muted/50 text-muted-foreground">
                    <tr>
                        <th className="h-12 px-4 py-3 align-middle font-medium">Nombre</th>
                        <th className="h-12 px-4 py-3 align-middle font-medium">Estado</th>
                        <th className="h-12 px-4 py-3 align-middle font-medium text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((country) => (
                        <tr key={country.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle">{country.name}</td>
                            <td className="p-4 align-middle">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${country.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {country.status === 1 ? 'Activo' : 'Inactivo'}
                                </span>
                            </td>
                            <td className="p-4 align-middle text-right">
                                <Button variant="ghost" size="icon" onClick={() => onEdit(country)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={3} className="p-4 text-center text-muted-foreground">
                                No se encontraron resultados
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
