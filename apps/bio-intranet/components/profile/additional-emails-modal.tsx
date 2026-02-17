'use client'

import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@repo/ui'
import { Trash2, Plus, Globe, Lock, Users, Loader2, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { updateAdditionalEmails } from '@/app/[locale]/dashboard/profile/actions'
import { toast } from 'sonner'
import { AdditionalEmail } from '@/lib/schemas/profile-extensions'

interface AdditionalEmailsModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    initialEmails?: AdditionalEmail[]
    locale: string
}

export function AdditionalEmailsModal({ isOpen, onOpenChange, initialEmails = [], locale }: AdditionalEmailsModalProps) {
    const t = useTranslations('Profile.additionalEmails')
    const [emails, setEmails] = useState<AdditionalEmail[]>(initialEmails)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setEmails(initialEmails)
        }
    }, [isOpen, initialEmails])

    const addEmail = () => {
        const newEmail: AdditionalEmail = {
            id: crypto.randomUUID(),
            email: '',
            visibility: 'private',
        }
        setEmails([...emails, newEmail])
    }

    const removeEmail = (id: string) => {
        setEmails(emails.filter(e => e.id !== id))
    }

    const updateEmail = (id: string, field: keyof AdditionalEmail, value: any) => {
        setEmails(emails.map(e => e.id === id ? { ...e, [field]: value } : e))
    }

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleSubmit = async () => {
        // Validation
        if (emails.some(e => !e.email || !validateEmail(e.email))) {
            toast.error(t('validationError'))
            return
        }

        setIsSubmitting(true)
        try {
            const result = await updateAdditionalEmails(locale, emails)
            if (result.error) {
                toast.error(t('error'))
            } else {
                toast.success(t('success'))
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
            <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('modalTitle')}</DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                        {t('description')}
                    </p>

                    <div className="space-y-3">
                        {emails.map((emailItem) => (
                            <div key={emailItem.id} className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                                <Input
                                    value={emailItem.email}
                                    onChange={(e) => updateEmail(emailItem.id, 'email', e.target.value)}
                                    placeholder={t('emailPlaceholder')}
                                    className="h-9 flex-1"
                                />
                                <Select
                                    value={emailItem.visibility}
                                    onValueChange={(val: string) => updateEmail(emailItem.id, 'visibility', val)}
                                >
                                    <SelectTrigger className="h-9 w-[110px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-3 w-3" />
                                                <span className="text-xs">{t('public')}</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="trusted">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-3 w-3" />
                                                <span className="text-xs">{t('trusted')}</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="private">
                                            <div className="flex items-center gap-2">
                                                <Lock className="h-3 w-3" />
                                                <span className="text-xs">{t('private')}</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => removeEmail(emailItem.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <Button
                        variant="ghost"
                        className="mt-2 w-full justify-start text-primary hover:text-primary hover:bg-primary/5"
                        onClick={addEmail}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {t('addEmail')}
                    </Button>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        {t('cancel')}
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
