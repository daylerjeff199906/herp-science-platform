
'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
    individualMultimediaSchema,
    IndividualMultimediaFormValues,
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

// TODO: Create service function for multimedia upload
async function uploadIndividualImages(id: number, data: FormData) {
    // Placeholder function
    console.log("Uploading images for individual", id, data)
    return { success: true, message: "Imágenes subidas correctamente" }
}

interface MultimediaFormProps {
    individualId: number
    initialImages?: any[] // Should be typed properly based on API response
}

export function MultimediaForm({ individualId, initialImages }: MultimediaFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)

    // Since we are likely uploading multiple images, we might want a schema that holds an array
    // But the request was for "3 forms".
    // Let's assume this form allows adding multiple images and then saving them.
    // However, typical multimedia management might be "add one by one" or "bulk upload".
    // Given the schema `individualMultimediaSchema` is for a SINGLE image object,
    // we should iterate or change the form state to hold an array of these objects.

    // We will use a wrapper schema for the form
    const formSchema = React.useMemo(() => {
        const z = require('zod')
        return z.object({
            images: z.array(individualMultimediaSchema)
        })
    }, [])

    const form = useForm<{ images: IndividualMultimediaFormValues[] }>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            images: [] // Start empty for new uploads
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'images',
    })

    const onSubmit = async (data: { images: IndividualMultimediaFormValues[] }) => {
        setIsLoading(true)
        try {
            // We need to construct FormData for file uploads
            // This depends heavily on how the backend expects the files.
            // If it expects one request per file, we loop.
            // If it expects one request with multiple files, we append all.

            // Assuming one request with multiple files or array of objects:
            const formData = new FormData()

            data.images.forEach((img, index) => {
                formData.append(`files[${index}]`, img.file)
                if (img.samplingSite) formData.append(`samplingSite[${index}]`, img.samplingSite)
                if (img.note) formData.append(`note[${index}]`, img.note)
                if (img.personId) formData.append(`personId[${index}]`, String(img.personId))
            })

            const result = await uploadIndividualImages(individualId, formData)

            if (result.success) {
                toast.success(result.message)
                form.reset({ images: [] })
                router.refresh()
            } else {
                toast.error("Error al subir imágenes")
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
                    <h3 className="text-lg font-medium">Multimedia</h3>
                    <p className="text-sm text-muted-foreground">
                        Sube imágenes asociadas al individuo.
                    </p>
                </div>

                {/* Display existing images - TODO: Implement list of existing images with delete option */}

                <div className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium text-sm">Nueva Imagen {index + 1}</h4>
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`images.${index}.file`}
                                    render={({ field: { value, onChange, ...fieldProps } }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm">Archivo</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...fieldProps}
                                                    value={undefined}
                                                    type="file"
                                                    accept="image/*"
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
                                    name={`images.${index}.samplingSite`}
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
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`images.${index}.personId`}
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

                                <FormField
                                    control={form.control}
                                    name={`images.${index}.note`}
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
                            </div>
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
                        Agregar Imagen
                    </Button>
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={isLoading || fields.length === 0}>
                        {isLoading ? 'Subiendo...' : 'Guardar Imágenes'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
