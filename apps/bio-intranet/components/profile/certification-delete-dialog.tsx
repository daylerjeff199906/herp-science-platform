'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import { deleteCertificationAction } from '@/app/[locale]/dashboard/profile/certifications/actions'
import { toast } from 'sonner'
import { Certification } from '@/types/certification'

interface DeleteCertificationDialogProps {
    certification: Certification | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function DeleteCertificationDialog({
    certification,
    isOpen,
    onOpenChange,
    onSuccess,
}: DeleteCertificationDialogProps) {
    const t = useTranslations('Profile.certifications.delete')
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!certification) return

        setIsDeleting(true)
        try {
            const result = await deleteCertificationAction(certification.id)
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
            setIsDeleting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>
                        {t('description')}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="ghost" disabled={isDeleting} onClick={() => onOpenChange(false)}>
                        {t('cancel')}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('confirm')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
