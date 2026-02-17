'use client'

import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
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
} from '@repo/ui'
import { Input } from '@/components/ui/input'
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
import { certificationSchema, CertificationFormValues } from '@/lib/schemas/certification'
import { createCertificationAction, updateCertificationAction } from '@/app/[locale]/dashboard/profile/certifications/actions'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Loader2, Globe, Lock, Users } from 'lucide-react'

interface CertificationModalProps {
    id?: string
    initialData?: CertificationFormValues
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function CertificationModal({
    id,
    initialData,
    isOpen,
    onOpenChange,
    onSuccess,
}: CertificationModalProps) {
    const t = useTranslations('Profile.certifications.form')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const defaultValues: CertificationFormValues = {
        name: initialData?.name || '',
        issuing_organization: initialData?.issuing_organization || '',
        issue_date: initialData?.issue_date || '',
        expiration_date: initialData?.expiration_date || '',
        credential_id: initialData?.credential_id || '',
        credential_url: initialData?.credential_url || '',
        visibility: initialData?.visibility || 'public',
        is_favorite: initialData?.is_favorite || false,
        id: initialData?.id,
    }

    const form = useForm<CertificationFormValues>({
        resolver: zodResolver(certificationSchema) as any,
        defaultValues,
    })

    useEffect(() => {
        if (isOpen) {
            form.reset(defaultValues)
        }
    }, [isOpen, initialData])

    const onSubmit = async (data: CertificationFormValues) => {
        setIsSubmitting(true)
        try {
            let result
            if (id) {
                result = await updateCertificationAction(id, data)
            } else {
                result = await createCertificationAction(data)
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
                    <DialogTitle>{id ? t('edit') : t('add')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="col-span-1 md:col-span-2">
                                        <FormLabel>{t('name')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('namePlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="issuing_organization"
                                render={({ field }) => (
                                    <FormItem className="col-span-1 md:col-span-2">
                                        <FormLabel>{t('issuingOrganization')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('issuingOrganizationPlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="issue_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('issueDate')}</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="expiration_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('expirationDate')}</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="credential_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('credentialId')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('credentialIdPlaceholder')} {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="credential_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('credentialUrl')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('credentialUrlPlaceholder')} {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="visibility"
                                render={({ field }) => (
                                    <FormItem className="col-span-1 md:col-span-2">
                                        <FormLabel>{t('visibility')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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
                                                        <div className="text-xs text-muted-foreground whitespace-normal">
                                                            {t('visibilityPublicDescription')}
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="trusted">
                                                    <div className="flex flex-col text-left">
                                                        <div className="font-semibold flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            {t('visibilityTrusted')}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground whitespace-normal">
                                                            {t('visibilityTrustedDescription')}
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="private">
                                                    <div className="flex flex-col text-left">
                                                        <div className="font-semibold flex items-center gap-2">
                                                            <Lock className="h-4 w-4" />
                                                            {t('visibilityPrivate')}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground whitespace-normal">
                                                            {t('visibilityPrivateDescription')}
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
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
