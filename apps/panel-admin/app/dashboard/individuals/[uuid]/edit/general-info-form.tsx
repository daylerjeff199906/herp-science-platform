
'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
    individualGeneralSchema,
    IndividualGeneralFormValues,
} from '@/lib/schemas/individuals'
import { updateIndividual, CreateIndividualData } from '@/services/individuals'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { GeneralInfoSection } from '../../components/form-sections/general-info'

// Reusing Option interface if exported or redefine
interface Option {
    id: number
    name: string
}

interface GeneralInfoFormProps {
    initialData?: IndividualGeneralFormValues & { id?: number }
    species: Option[]
    sexes: Option[]
    museums: Option[]
    occurrences: Option[]
    forestTypes: Option[]
    activities: Option[]
}

export function GeneralInfoForm({
    initialData,
    species,
    sexes,
    museums,
    occurrences,
    forestTypes,
    activities,
}: GeneralInfoFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)

    const form = useForm<IndividualGeneralFormValues>({
        resolver: zodResolver(individualGeneralSchema),
        defaultValues: initialData || {
            status: 1,
            hasEggs: false,
        },
    })

    const onSubmit = async (data: IndividualGeneralFormValues) => {
        if (!initialData?.id) {
            toast.error("ID del individuo no encontrado");
            return;
        }

        setIsLoading(true)
        try {
            const formattedData: Partial<CreateIndividualData> = {
                ...data,
                weight: data.weight ? String(data.weight) : undefined,
                slaughteredWeight: data.slaughteredWeight ? String(data.slaughteredWeight) : undefined,
                svl: data.svl ? String(data.svl) : undefined,
                tailLength: data.tailLength ? String(data.tailLength) : undefined,
                // Ensure types match what updateIndividual expects
                sexId: Number(data.sexId),
                activityId: Number(data.activityId),
                museumId: Number(data.museumId),
                speciesId: Number(data.speciesId),
                occurrenceId: data.occurrenceId ? Number(data.occurrenceId) : undefined,
                forestTypeId: data.forestId ? Number(data.forestId) : undefined,
            }

            const result = await updateIndividual(initialData.id, formattedData)

            if (result.success) {
                toast.success(result.message || 'Información actualizada')
                router.refresh()
            } else {
                toast.error(typeof result.error === 'string' ? result.error : 'Error al actualizar')
            }
        } catch (error) {
            console.error(error)
            toast.error('Ocurrió un error inesperado')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div>
                    <h3 className="text-lg font-medium">Información General</h3>
                    <p className="text-sm text-muted-foreground">
                        Actualiza los datos básicos del individuo.
                    </p>
                </div>
                <Separator />

                <GeneralInfoSection
                    form={form}
                    options={{ species, sexes, museums, occurrences, forestTypes, activities }}
                />

                <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
