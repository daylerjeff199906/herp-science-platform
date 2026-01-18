'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createOrUpdateCountry } from '@/services/countries';
import { countrySchema, CountryFormValues } from '@/lib/schemas/countries';
import { ICountry } from '@/types';
import { useEffect } from 'react';

interface CountriesFormProps {
    initialData?: ICountry | null;
    onSuccess: () => void;
}

export function CountriesForm({ initialData, onSuccess }: CountriesFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CountryFormValues>({
        defaultValues: {
            name: '',
            status: 1,
        },
        // Manual resolver implementation since @hookform/resolvers might be missing
        resolver: async (values) => {
            const result = countrySchema.safeParse(values);
            if (result.success) {
                return { values: result.data, errors: {} };
            }
            const formattedErrors = result.error.errors.reduce((acc, current) => {
                return {
                    ...acc,
                    [current.path[0] as string]: {
                        type: current.code,
                        message: current.message,
                    },
                };
            }, {});
            return { values: {}, errors: formattedErrors };
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name,
                status: initialData.status ?? 1,
            });
        } else {
            reset({
                name: '',
                status: 1,
            });
        }
    }, [initialData, reset]);

    const onSubmit = async (data: CountryFormValues) => {
        try {
            let response;
            if (initialData) {
                // Edit mode: Omit status
                const { status, ...rest } = data;
                response = await createOrUpdateCountry({
                    id: initialData.id,
                    data: rest as any, // Cast to avoid strict type mismatch if ICountryPost requires status
                });
            } else {
                // Create mode
                response = await createOrUpdateCountry({ data });
            }

            if (response.data) {
                toast.success(response.message || 'Operación exitosa');
                onSuccess();
            } else {
                toast.error(typeof response.error === 'string' ? response.error : 'Error desconocido');
            }
        } catch (error) {
            console.error(error);
            toast.error('Ocurrió un error inesperado');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" {...register('name')} placeholder="Ingrese el nombre del país" />
                {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
            </div>

            {/* Only show status if creating, or maybe hidden default? 
          User said: "cuando es editar qu no envbie el status".
          Schema has status. If creating, we probably want to send it. 
          If editing, we ignore it.
          Let's assume default 1 is fine for hidden input/logic, 
          or if user wants a status field in UI, I should add it.
          "en el mimmo componente que se use para añadir y editar".
          The schema provided by user: { "name": "Peru", "status": 1 }.
          I'll assume status is implied or fixed, or maybe I should add an input?
          Given the user requirement, I will add a hidden input or just logic. 
          The schema forces a number.
      */}

            <div className="flex justify-end gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar' : 'Guardar'}
                </Button>
            </div>
        </form>
    );
}
