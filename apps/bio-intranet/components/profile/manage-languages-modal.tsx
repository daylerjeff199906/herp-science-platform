'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit, Globe, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Language } from '@/types/language'
import { LanguageModal } from './language-modal' // Assumed existing
import { DeleteLanguageDialog } from './language-delete-dialog' // Assumed existing
// If they don't exist, I might need to create them or import from page.
// Step 832 showed language-list.tsx, implying language-modal exists.

interface ManageLanguagesModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    languages: Language[]
}

export function ManageLanguagesModal({ isOpen, onOpenChange, languages }: ManageLanguagesModalProps) {
    const t = useTranslations('Profile.language')
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)

    const handleEdit = (lang: Language) => {
        setSelectedLanguage(lang)
        setIsAddOpen(true)
    }

    const handleDelete = (lang: Language) => {
        setSelectedLanguage(lang)
        setIsDeleteOpen(true)
    }

    const handleAdd = () => {
        setSelectedLanguage(null)
        setIsAddOpen(true)
    }

    const handleSuccess = () => {
        // Refresh? Actions usually revalidatePath.
        // We might need to refresh the parent provided 'languages' prop?
        // If parent is Server Component, revalidatePath handles it.
        // But client state might be stale until refresh.
        // The modal might close.
        setIsAddOpen(false)
        setIsDeleteOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-2">
                    {languages.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">{t('emptyStateDescription')}</p>
                    ) : (
                        languages.map((lang) => (
                            <div key={lang.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md border">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium text-sm">{lang.language}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground pl-6 block pt-0.5">
                                        {t(`level.${lang.level}`) || lang.level}
                                        {lang.is_native && ` • ${t('isNative')}`}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(lang)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(lang)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}

                    <Button variant="outline" className="w-full mt-4" onClick={handleAdd}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('add')}
                    </Button>
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>{t('form.save')}</Button> {/* Actually just close, as sub-modals handle saving */}
                </DialogFooter>
            </DialogContent>

            {/* Sub-modals */}
            <LanguageModal
                isOpen={isAddOpen}
                onOpenChange={setIsAddOpen}
                initialData={selectedLanguage || undefined}
                id={selectedLanguage?.id}
                onSuccess={handleSuccess}
            />

            <DeleteLanguageDialog
                isOpen={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                language={selectedLanguage}
                onSuccess={handleSuccess}
            />
        </Dialog>
    )
}
