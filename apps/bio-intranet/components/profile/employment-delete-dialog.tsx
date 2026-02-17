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
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { deleteEmploymentAction } from '@/app/[locale]/dashboard/profile/employment/actions'
import { Loader2, AlertTriangle } from 'lucide-react'

interface EmploymentDeleteDialogProps {
    id: string
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function EmploymentDeleteDialog({
    id,
    isOpen,
    onOpenChange,
    onSuccess,
}: EmploymentDeleteDialogProps) {
    const t = useTranslations('Profile.employment.delete')
    const [isDeleting, setIsDeleting] = useState(false)
    const [confirmation, setConfirmation] = useState('')

    const handleDelete = async () => {
        if (confirmation !== 'DELETE') return

        setIsDeleting(true)
        try {
            const result = await deleteEmploymentAction(id)
            if (result.error) {
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
            setConfirmation('')
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        {t('title')}
                    </DialogTitle>
                    <DialogDescription>{t('description')}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm font-medium mb-2">
                        {t('confirmInstruction')}
                    </p>
                    <Input
                        value={confirmation}
                        onChange={(e) => setConfirmation(e.target.value)}
                        placeholder="DELETE"
                        className="bg-muted"
                    />
                </div>
                <DialogFooter>
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
                        disabled={confirmation !== 'DELETE' || isDeleting}
                    >
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('confirm')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
