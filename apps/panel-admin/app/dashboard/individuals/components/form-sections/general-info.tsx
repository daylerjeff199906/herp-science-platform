
'use client'

import { UseFormReturn } from 'react-hook-form'
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
import { Checkbox } from '@/components/ui/checkbox'
import { IndividualGeneralFormValues } from '@/lib/schemas/individuals'
import { Separator } from '@/components/ui/separator'

interface Option {
    id: number
    name: string
}

interface GeneralInfoSectionProps {
    form: UseFormReturn<IndividualGeneralFormValues>
    options: {
        species: Option[]
        sexes: Option[]
        museums: Option[]
        occurrences: Option[]
        forestTypes: Option[]
        activities: Option[]
    }
}

export function GeneralInfoSection({ form, options }: GeneralInfoSectionProps) {
    return (
        <div className="flex flex-col gap-8">

            {/* 1. Identification & Taxonomy */}
            <div>
                <h3 className="text-base font-semibold">Identificación y Taxonomía</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Datos de identificación del individuo y su clasificación taxonómica.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Código de Colección</FormLabel>
                                <FormControl>
                                    <Input placeholder="CB-IIAP-001" {...field} className="text-sm" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="speciesId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Especie</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value ? String(field.value) : undefined}>
                                    <FormControl>
                                        <SelectTrigger className="text-sm">
                                            <SelectValue placeholder="Selecciona una especie" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {options?.species?.map((option) => (
                                            <SelectItem key={option.id} value={String(option.id)} className="text-sm">
                                                {option.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sexId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Sexo</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value ? String(field.value) : undefined}>
                                    <FormControl>
                                        <SelectTrigger className="text-sm">
                                            <SelectValue placeholder="Selecciona sexo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {options?.sexes?.map((option) => (
                                            <SelectItem key={option.id} value={String(option.id)} className="text-sm">
                                                {option.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Estado</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value ? String(field.value) : undefined}>
                                    <FormControl>
                                        <SelectTrigger className="text-sm">
                                            <SelectValue placeholder="Estado" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="1" className="text-sm">No Publicado</SelectItem>
                                        <SelectItem value="2" className="text-sm">Publicado</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            <Separator />

            {/* 2. Location & Context */}
            <div>
                <h3 className="text-base font-semibold">Ubicación y Contexto</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Información sobre el lugar de colecta, entorno y actividad.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="museumId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Museo</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value ? String(field.value) : undefined}>
                                    <FormControl>
                                        <SelectTrigger className="text-sm">
                                            <SelectValue placeholder="Museo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {options?.museums?.map((option) => (
                                            <SelectItem key={option.id} value={String(option.id)} className="text-sm">
                                                {option.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="occurrenceId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Ocurrencia</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value ? String(field.value) : undefined}>
                                    <FormControl>
                                        <SelectTrigger className="text-sm">
                                            <SelectValue placeholder="Ocurrencia" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {options?.occurrences?.map((option) => (
                                            <SelectItem key={option.id} value={String(option.id)} className="text-sm">
                                                {option.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="forestId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Tipo de Bosque</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value ? String(field.value) : undefined}>
                                    <FormControl>
                                        <SelectTrigger className="text-sm">
                                            <SelectValue placeholder="Bosque" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {options?.forestTypes?.map((option) => (
                                            <SelectItem key={option.id} value={String(option.id)} className="text-sm">
                                                {option.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="activityId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Actividad</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value ? String(field.value) : undefined}>
                                    <FormControl>
                                        <SelectTrigger className="text-sm">
                                            <SelectValue placeholder="Actividad" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {options?.activities?.map((option) => (
                                            <SelectItem key={option.id} value={String(option.id)} className="text-sm">
                                                {option.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            <Separator />

            {/* 3. Biometrics */}
            <div>
                <h3 className="text-base font-semibold">Biometría</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Medidas físicas y características reproductivas.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Peso (g)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} className="text-sm" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="slaughteredWeight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Peso Sacrificado (g)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} className="text-sm" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="svl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">SVL (mm)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} className="text-sm" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tailLength"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Longitud de Cola (mm)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} className="text-sm" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="hasEggs"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md p-2">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm font-normal">
                                        ¿Presenta huevos?
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            <Separator />

            {/* 4. Molecular & Registration Dates */}
            <div>
                <h3 className="text-base font-semibold">Datos Moleculares y Registro</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Información genética y fechas de identificación.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="geneticBarcode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Código Genético</FormLabel>
                                <FormControl>
                                    <Input placeholder="AB123456" {...field} className="text-sm" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="depositCodeGenbank"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Genbank URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} className="text-sm" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="identDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Fecha Identificación</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} className="text-sm" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="identTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Hora Identificación</FormLabel>
                                <FormControl>
                                    <Input type="time" step="1" {...field} className="text-sm" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    )
}
