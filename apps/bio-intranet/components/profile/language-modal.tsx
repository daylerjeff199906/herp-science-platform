'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@repo/ui'
import {
    Input
} from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@repo/ui'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { languageSchema, LanguageFormValues } from '@/lib/schemas/language'
import { createLanguageAction, updateLanguageAction } from '@/app/[locale]/dashboard/profile/languages/actions'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Loader2, Globe, Lock, Users } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

interface LanguageModalProps {
    id?: string
    initialData?: LanguageFormValues
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function LanguageModal({
    id,
    initialData,
    isOpen,
    onOpenChange,
    onSuccess,
}: LanguageModalProps) {
    const t = useTranslations('Profile.language.form')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const defaultValues: LanguageFormValues = {
        language: initialData?.language || '',
        level: initialData?.level || 'basic',
        is_native: initialData?.is_native || false,
        visibility: initialData?.visibility || 'public',
        is_favorite: initialData?.is_favorite || false,
        id: initialData?.id,
    }

    const form = useForm<LanguageFormValues>({
        resolver: zodResolver(languageSchema),
        defaultValues,
    })

    React.useEffect(() => {
        if (isOpen) {
            form.reset(defaultValues)
        }
    }, [isOpen, initialData])

    const onSubmit = async (data: LanguageFormValues) => {
        setIsSubmitting(true)
        try {
            let result
            if (id) {
                result = await updateLanguageAction(id, data)
            } else {
                result = await createLanguageAction(data)
            }

            if (result && 'error' in result) {
                toast.error(t('error'))
            } else {
                toast.success(t('success'))
                onSuccess()
                onOpenChange(false)
            }
        } catch (error) {
            toast.error(t('error'))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{id ? t('editTitle') : t('createTitle')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="language"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('language')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('languagePlaceholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('level')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('levelPlaceholder')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="basic">{t('basic')}</SelectItem>
                                            <SelectItem value="intermediate">{t('intermediate')}</SelectItem>
                                            <SelectItem value="advanced">{t('advanced')}</SelectItem>
                                            <SelectItem value="fluent">{t('fluent')}</SelectItem>
                                            <SelectItem value="native">{t('native')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_native"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            {t('isNative')}
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="visibility"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('visibility')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-auto items-start py-3">
                                                <SelectValue placeholder={t('visibilityPlaceholder')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="public">
                                                <div className="flex flex-col text-left">
                                                    <div className="font-semibold flex items-center gap-2">
                                                        <Globe className="h-4 w-4" />
                                                        {t('visibilityPublic')}
                                                    </div>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="trusted">
                                                <div className="flex flex-col text-left">
                                                    <div className="font-semibold flex items-center gap-2">
                                                        <Users className="h-4 w-4" />
                                                        {t('visibilityTrusted')}
                                                    </div>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="private">
                                                <div className="flex flex-col text-left">
                                                    <div className="font-semibold flex items-center gap-2">
                                                        <Lock className="h-4 w-4" />
                                                        {t('visibilityPrivate')}
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                                {t('cancel')}
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t('save')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
