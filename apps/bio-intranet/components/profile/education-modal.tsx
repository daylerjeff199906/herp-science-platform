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
import { educationSchema, EducationFormValues } from '@/lib/schemas/education'
import { createEducationAction, updateEducationAction } from '@/app/[locale]/dashboard/profile/education/actions'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Loader2, Globe, Lock, Users } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

interface EducationModalProps {
    id?: string
    initialData?: EducationFormValues
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function EducationModal({
    id,
    initialData,
    isOpen,
    onOpenChange,
    onSuccess,
}: EducationModalProps) {
    const t = useTranslations('Profile.education.form')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Ensure default values handle nulls from DB by falling back to empty strings
    const defaultValues: EducationFormValues = {
        institution: initialData?.institution || '',
        title: initialData?.title || '',
        status: initialData?.status || 'completed',
        start_date: initialData?.start_date || '',
        end_date: initialData?.end_date || '',
        visibility: initialData?.visibility || 'public',
        is_current: initialData?.is_current || false,
        degree: initialData?.degree || '',
        field_of_study: initialData?.field_of_study || '',
        city: initialData?.city || '',
        region_state: initialData?.region_state || '',
        country: initialData?.country || '',
        scope: initialData?.scope || '',
        id: initialData?.id,
    }

    const form = useForm<EducationFormValues>({
        resolver: zodResolver(educationSchema),
        defaultValues,
    })

    // Reset form when modal opens with new/different data
    React.useEffect(() => {
        if (isOpen) {
            form.reset(defaultValues)
        }
    }, [isOpen, initialData])

    const onSubmit = async (data: EducationFormValues) => {
        setIsSubmitting(true)
        try {
            let result
            if (id) {
                result = await updateEducationAction(id, data)
            } else {
                result = await createEducationAction(data)
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
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{id ? t('editTitle') : t('createTitle')}</DialogTitle>
                    <DialogDescription>
                        {t('description')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="institution"
                                render={({ field }) => (
                                    <FormItem className="col-span-1 md:col-span-2">
                                        <FormLabel>{t('institution')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('institutionPlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="col-span-1 md:col-span-2">
                                        <FormLabel>{t('titleLabel')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('titlePlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="degree"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('degree')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('degreePlaceholder')} {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="field_of_study"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('fieldOfStudy')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('fieldOfStudyPlaceholder')} {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="start_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('startDate')}</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="end_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('endDate')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                value={field.value || ''}
                                                disabled={form.watch('is_current')}
                                                className={cn(form.watch('is_current') && "opacity-50")}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="is_current"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm col-span-1 md:col-span-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="font-semibold">
                                                {t('isCurrent')}
                                            </FormLabel>
                                            <FormDescription>
                                                {t('isCurrentDescription')}
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="col-span-1 md:col-span-2">
                                        <FormLabel>{t('status')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('statusPlaceholder')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="completed">{t('statusCompleted')}</SelectItem>
                                                <SelectItem value="in_progress">{t('statusInProgress')}</SelectItem>
                                                <SelectItem value="dropped">{t('statusDropped')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="visibility"
                                render={({ field }) => (
                                    <FormItem className="space-y-3 col-span-1 md:col-span-2">
                                        <FormLabel>{t('visibility')}</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="grid grid-cols-1 gap-4 pt-2"
                                            >
                                                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                                    <FormControl>
                                                        <RadioGroupItem value="public" className="mt-1" />
                                                    </FormControl>
                                                    <div className="space-y-1">
                                                        <FormLabel className="font-normal flex items-center gap-2">
                                                            <Globe className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-semibold">{t('visibilityPublic')}</span>
                                                        </FormLabel>
                                                        <FormDescription>
                                                            {t('visibilityPublicDescription')}
                                                        </FormDescription>
                                                    </div>
                                                </FormItem>
                                                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                                    <FormControl>
                                                        <RadioGroupItem value="trusted" className="mt-1" />
                                                    </FormControl>
                                                    <div className="space-y-1">
                                                        <FormLabel className="font-normal flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-semibold">{t('visibilityTrusted')}</span>
                                                        </FormLabel>
                                                        <FormDescription>
                                                            {t('visibilityTrustedDescription')}
                                                        </FormDescription>
                                                    </div>
                                                </FormItem>
                                                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                                    <FormControl>
                                                        <RadioGroupItem value="private" className="mt-1" />
                                                    </FormControl>
                                                    <div className="space-y-1">
                                                        <FormLabel className="font-normal flex items-center gap-2">
                                                            <Lock className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-semibold">{t('visibilityPrivate')}</span>
                                                        </FormLabel>
                                                        <FormDescription>
                                                            {t('visibilityPrivateDescription')}
                                                        </FormDescription>
                                                    </div>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
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
