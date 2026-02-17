"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { GeneralProfileSchema, GeneralProfileData } from "@/lib/schemas/profile"
import { updateGeneralProfile } from "@/app/[locale]/dashboard/profile/actions"
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
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@repo/ui"

interface GeneralFormProps {
    initialData: Partial<GeneralProfileData>
    locale: string
}

export function GeneralForm({ initialData, locale }: GeneralFormProps) {
    const t = useTranslations('Profile')
    const [isPending, setIsPending] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<GeneralProfileData>({
        resolver: zodResolver(GeneralProfileSchema),
        defaultValues: {
            firstName: initialData.firstName || '',
            lastName: initialData.lastName || '',
            email: initialData.email || '',
            bio: initialData.bio || '',
            location: initialData.location || '',
            birthDate: initialData.birthDate || '',
            phone: initialData.phone || '',
        },
    })

    async function onSubmit(data: GeneralProfileData) {
        setIsPending(true)
        setError(null)
        setSuccess(false)
        try {
            const response = await updateGeneralProfile(locale, data)
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('form.firstName')}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('form.lastName')}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('form.email')}</FormLabel>
                            <FormControl>
                                <Input {...field} disabled className="bg-muted" />
                            </FormControl>
                            <FormDescription>
                                Email cannot be changed directly.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('form.bio')}</FormLabel>
                            <FormControl>
                                <Textarea {...field} rows={4} className="resize-none" />
                            </FormControl>
                            <FormDescription>
                                Brief description for your profile.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('form.location')}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('form.phone')}</FormLabel>
                                <FormControl>
                                    <Input {...field} type="tel" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>{t('form.birthDate')}</FormLabel>
                            <FormControl>
                                {/* Simple date input for now, ideally use a Calendar component */}
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                        {t('form.cancel')}
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('form.save')}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
