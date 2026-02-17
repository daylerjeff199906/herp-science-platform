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
    Button
} from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { deleteEducationAction } from '@/app/[locale]/dashboard/profile/education/actions'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface EducationDeleteDialogProps {
    id: string
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function EducationDeleteDialog({
    id,
    isOpen,
    onOpenChange,
    onSuccess,
}: EducationDeleteDialogProps) {
    const t = useTranslations('Profile.education.delete')
    const [confirmationInput, setConfirmationInput] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const response = await deleteEducationAction(id)
            if (response && 'error' in response) {
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>
                        {t('description')}
                        <br />
                        {t('confirmInstruction')}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="DELETE"
                        value={confirmationInput}
                        onChange={(e) => setConfirmationInput(e.target.value)}
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={confirmationInput !== 'DELETE' || isDeleting}
                    >
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('confirm')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
