"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AcademicProfileSchema, AcademicProfileData } from "@/lib/schemas/profile"
import { updateAcademicProfile } from "@/app/[locale]/dashboard/profile/actions"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@repo/ui"
import { Input } from "@repo/ui"
import { Textarea } from "@repo/ui"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui"
import { Alert, AlertDescription, AlertTitle } from "@repo/ui"
import { Loader2, Plus, X, AlertCircle, CheckCircle2 } from "lucide-react"
import { dedicationOptions } from "@/lib/schemas/onboarding"

interface AcademicFormProps {
    initialData: Partial<AcademicProfileData>
    locale: string
}

export function AcademicForm({ initialData, locale }: AcademicFormProps) {
    const t = useTranslations('Profile')
    const [isPending, setIsPending] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<AcademicProfileData>({
        resolver: zodResolver(AcademicProfileSchema),
        defaultValues: {
            institution: initialData.institution || '',
            dedication: initialData.dedication || undefined,
            currentPosition: initialData.currentPosition || '',
            website: initialData.website || '',
            expertiseAreas: initialData.expertiseAreas || [],
            researchInterests: initialData.researchInterests || '',
            areasOfInterest: initialData.areasOfInterest || [],
        },
    })

    // Helper for expertise areas (array)
    const [newArea, setNewArea] = useState('')
    const areas = form.watch('expertiseAreas') || []

    const addArea = () => {
        if (newArea.trim() && !areas.includes(newArea.trim())) {
            form.setValue('expertiseAreas', [...areas, newArea.trim()])
            setNewArea('')
        }
    }

    const removeArea = (area: string) => {
        form.setValue('expertiseAreas', areas.filter(a => a !== area))
    }

    async function onSubmit(data: AcademicProfileData) {
        setIsPending(true)
        setError(null)
        setSuccess(false)
        try {
            const response = await updateAcademicProfile(locale, data)
            if (response.error) {
                setError(response.error)
            } else {
                setSuccess(true)
            }
        } catch (error) {
            setError(t('messages.updateError'))
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {success && (
                    <Alert className="border-green-500 text-green-600 bg-green-50">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{t('messages.updateSuccess')}</AlertDescription>
                    </Alert>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <FormField
                    control={form.control}
                    name="institution"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('form.institution')}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="currentPosition"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('form.currentPosition')}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dedication"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('form.dedication')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select dedication" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {dedicationOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
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
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('form.website')}</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="https://..." />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Expertise Areas */}
                <div className="space-y-2">
                    <FormLabel>{t('form.expertiseAreas')}</FormLabel>
                    <div className="flex gap-2">
                        <Input
                            value={newArea}
                            onChange={(e) => setNewArea(e.target.value)}
                            placeholder="Add an area..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    addArea()
                                }
                            }}
                        />
                        <Button type="button" onClick={addArea} size="icon" variant="secondary">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {areas.map(area => (
                            <div key={area} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                {area}
                                <button type="button" onClick={() => removeArea(area)} className="text-muted-foreground hover:text-foreground">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <FormDescription>Select up to 10 areas.</FormDescription>
                </div>

                <FormField
                    control={form.control}
                    name="researchInterests"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('form.researchInterests')}</FormLabel>
                            <FormControl>
                                <Textarea {...field} rows={4} className="resize-none" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('form.save')}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
