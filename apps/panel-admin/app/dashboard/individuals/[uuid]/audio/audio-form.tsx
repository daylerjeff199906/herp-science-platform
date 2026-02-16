
'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
    individualAudioSchema,
    IndividualAudioFormValues,
} from '@/lib/schemas/individuals'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Trash2, Plus } from 'lucide-react'

// TODO: Create service function for audio upload
async function uploadIndividualAudio(id: number, data: FormData) {
    // Placeholder function
    console.log("Uploading audio for individual", id, data)
    return { success: true, message: "Audio subido correctamente" }
}

interface AudioFormProps {
    individualId: number
    initialAudio?: any[] // Should be typed properly based on API response
}

export function AudioForm({ individualId, initialAudio }: AudioFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)

    // Similar to multimedia, we allow adding multiple audio files if needed
    // But since `individualAudioSchema` handles histograms differently (audio file + array of histogram images)
    // We stick to the request: "3 forms with respective schemas".

    // Using a wrapper schema for array
    const formSchema = React.useMemo(() => {
        const z = require('zod')
        return z.object({
            audios: z.array(individualAudioSchema)
        })
    }, [])

    const form = useForm<{ audios: IndividualAudioFormValues[] }>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            audios: []
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'audios',
    })

    const onSubmit = async (data: { audios: IndividualAudioFormValues[] }) => {
        setIsLoading(true)
        try {
            const formData = new FormData()

            data.audios.forEach((audio, index) => {
                formData.append(`files[${index}]`, audio.file)
                if (audio.samplingSite) formData.append(`samplingSite[${index}]`, audio.samplingSite)
                if (audio.note) formData.append(`note[${index}]`, audio.note)
                if (audio.personId) formData.append(`personId[${index}]`, String(audio.personId))

                // Assuming histograms work this way:
                if (audio.files && audio.files.length > 0) {
                    audio.files.forEach((hist, histIndex) => {
                        formData.append(`histograms[${index}][${histIndex}]`, hist)
                    })
                }
            })

            const result = await uploadIndividualAudio(individualId, formData)

            if (result.success) {
                toast.success(result.message)
                form.reset({ audios: [] })
                router.refresh()
            } else {
                toast.error("Error al subir audio")
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
                    <h3 className="text-lg font-medium">Sonidos (Audio)</h3>
                    <p className="text-sm text-muted-foreground">
                        Sube archivos de audio y sus histogramas asociados.
                    </p>
                </div>

                <div className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium text-sm">Nuevo Audio {index + 1}</h4>
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`audios.${index}.file`}
                                    render={({ field: { value, onChange, ...fieldProps } }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm">Archivo de Audio</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...fieldProps}
                                                    value={undefined}
                                                    type="file"
                                                    accept="audio/*"
                                                    className="text-sm"
                                                    onChange={(event) => {
                                                        onChange(event.target.files && event.target.files[0])
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`audios.${index}.files`}
                                    render={({ field: { value, onChange, ...fieldProps } }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm">Histogramas (Imágenes, Máx 10)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...fieldProps}
                                                    value={undefined}
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    className="text-sm"
                                                    onChange={(event) => {
                                                        const files = Array.from(event.target.files || [])
                                                        onChange(files)
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`audios.${index}.samplingSite`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm">Sitio</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="text-sm">
                                                        <SelectValue placeholder="Selecciona sitio" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="EN_CAMPO" className="text-sm">En Campo</SelectItem>
                                                    <SelectItem value="EN_ESTUDIO" className="text-sm">En Estudio</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`audios.${index}.personId`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm">Autor (ID)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} value={field.value || ''} className="text-sm" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name={`audios.${index}.note`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Nota</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Descripción" {...field} value={field.value || ''} className="text-sm" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Separator />
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => append({ personId: undefined } as any)}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Audio
                    </Button>
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={isLoading || fields.length === 0}>
                        {isLoading ? 'Subiendo...' : 'Guardar Audios'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
