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
import { createIndividual, CreateIndividualData } from '@/services/individuals'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { GeneralInfoSection } from '../components/form-sections/general-info'

// Reusing Option interface if exported or redefine
interface Option {
    id: number
    name: string
}

interface CreateGeneralFormProps {
    species: Option[]
    sexes: Option[]
    museums: Option[]
    occurrences: Option[]
    forestTypes: Option[]
    activities: Option[]
}

export function CreateGeneralForm({
    species,
    sexes,
    museums,
    occurrences,
    forestTypes,
    activities,
}: CreateGeneralFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)

    const form = useForm<IndividualGeneralFormValues>({
        resolver: zodResolver(individualGeneralSchema),
        defaultValues: {
            status: 1,
            hasEggs: false,
        },
    })

    const onSubmit = async (data: IndividualGeneralFormValues) => {
        setIsLoading(true)
        try {
            const formattedData: CreateIndividualData = {
                ...data,
                weight: data.weight ? String(data.weight) : undefined,
                slaughteredWeight: data.slaughteredWeight ? String(data.slaughteredWeight) : undefined,
                svl: data.svl ? String(data.svl) : undefined,
                tailLength: data.tailLength ? String(data.tailLength) : undefined,
                sexId: Number(data.sexId),
                code: data.code,
                identDate: data.identDate || '',
                identTime: data.identTime || '',
                geneticBarcode: data.geneticBarcode,
                depositCodeGenbank: data.depositCodeGenbank,
                hasEggs: data.hasEggs,
                activityId: Number(data.activityId),
                museumId: Number(data.museumId),
                speciesId: Number(data.speciesId),
                occurrenceId: data.occurrenceId || undefined,
                forestTypeId: data.forestId || undefined,
                identifiers: []
            }

            const result = await createIndividual(formattedData)

            if (result.success) {
                toast.success(result.message || 'Individuo creado correctamente')

                if (result.data && result.data.id) {
                    router.push(`/dashboard/individuals/${result.data.id}/edit`)
                } else {
                    router.push('/dashboard/individuals')
                }
            } else {
                toast.error(typeof result.error === 'string' ? result.error : 'Error al crear')
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
                <GeneralInfoSection
                    form={form}
                    options={{ species, sexes, museums, occurrences, forestTypes, activities }}
                />

                <div className="flex justify-end gap-2 mt-6">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Creando...' : 'Crear Individuo'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
