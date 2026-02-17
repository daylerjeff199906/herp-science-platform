'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { deleteProfessionalActivityAction } from '@/app/[locale]/dashboard/profile/professional-activities/actions'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { ProfessionalActivity } from '@/types/professional-activity'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DeleteProfessionalActivityDialogProps {
    activity: ProfessionalActivity | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function DeleteProfessionalActivityDialog({
    activity,
    isOpen,
    onOpenChange,
    onSuccess,
}: DeleteProfessionalActivityDialogProps) {
    const t = useTranslations('Profile.professionalActivity.delete')
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!activity) return

        setIsDeleting(true)
        try {
            const result = await deleteProfessionalActivityAction(activity.id)
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
