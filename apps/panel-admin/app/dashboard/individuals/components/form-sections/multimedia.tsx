
'use client'

import { UseFormReturn, useFieldArray } from 'react-hook-form'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { IndividualMultimediaFormValues } from '@/lib/schemas/individuals'
import { Trash2, Plus } from 'lucide-react'

interface MultimediaSectionFormValues {
    images: IndividualMultimediaFormValues[]
}

interface MultimediaSectionProps {
    form: UseFormReturn<MultimediaSectionFormValues>
}

export function MultimediaSection({ form }: MultimediaSectionProps) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'images',
    })

    return (
        <div className="space-y-4">
            {fields.map((field, index) => (
                <Card key={field.id}>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <h4 className="font-medium">Imagen {index + 1}</h4>
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <FormField
                            control={form.control}
                            name={`images.${index}.file`}
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                                <FormItem>
                                    <FormLabel>Archivo de Imagen</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...fieldProps}
                                            value={undefined}
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) => {
                                                onChange(event.target.files && event.target.files[0])
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name={`images.${index}.samplingSite`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sitio de Muestreo</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona sitio" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="EN_CAMPO">En Campo</SelectItem>
                                                <SelectItem value="EN_ESTUDIO">En Estudio</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`images.${index}.personId`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Autor (ID)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name={`images.${index}.note`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nota</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Descripción de la imagen" {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </CardContent>
                </Card>
            ))}

            <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ personId: undefined } as any)}
            >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Imagen
            </Button>
        </div>
    )
}
