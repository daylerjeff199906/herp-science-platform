'use client'

import React, { useState } from 'react'
import { Language } from '@/types/language'
import { Card, CardContent } from '@repo/ui'
import { useTranslations } from 'next-intl'
import { Edit, Trash2, Globe, Users, Lock, ChevronDown, ChevronUp, Star, GraduationCap, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LanguageModal } from './language-modal'
import { DeleteLanguageDialog } from './language-delete-dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@repo/ui'
import { toggleLanguageFavoriteAction, updateLanguageVisibilityAction } from '@/app/[locale]/dashboard/profile/languages/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface LanguageListProps {
    languages: Language[]
}

export function LanguageList({ languages }: LanguageListProps) {
    const t = useTranslations('Profile.language')
    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const handleEdit = (language: Language) => {
        setSelectedLanguage(language)
        setIsEditOpen(true)
    }

    const handleDelete = (language: Language) => {
        setSelectedLanguage(language)
        setIsDeleteOpen(true)
    }

    const handleSuccess = () => {
        setSelectedLanguage(null)
    }



    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">{t('title')}</h2>
                    <p className="text-muted-foreground">{t('description')}</p>
                </div>
                <LanguageCreateButton />
            </div>

            <div className="grid gap-4">
                {languages.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                            <GraduationCap className="h-10 w-10 mb-4 opacity-20" />
                            <h3 className="mt-2 text-lg font-semibold">{t.has('emptyStateTitle') ? t('emptyStateTitle') : t('title')}</h3>
                            <p className="mb-2 mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                                {t.has('emptyStateDescription') ? t('emptyStateDescription') : t('description')}
                            </p>
                            <div className="mt-2">
                                <LanguageCreateButton />
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    languages.map((language) => (
                        <LanguageItem
                            key={language.id}
                            language={language}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>

            <LanguageModal
                id={selectedLanguage?.id}
                initialData={selectedLanguage || undefined}
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
                onSuccess={handleSuccess}
            />

            <DeleteLanguageDialog
                language={selectedLanguage}
                isOpen={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onSuccess={handleSuccess}
            />
        </div>
    )
}

function LanguageCreateButton() {
    const t = useTranslations('Profile.language')
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('add')}
            </Button>
            <LanguageModal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                onSuccess={() => { }}
            />
        </>
    )
}

interface LanguageItemProps {
    language: Language
    onEdit: (language: Language) => void
    onDelete: (language: Language) => void
}

function LanguageItem({ language, onEdit, onDelete }: LanguageItemProps) {
    const tForm = useTranslations('Profile.language.form')
    const [isFavorite, setIsFavorite] = useState(language.is_favorite || false)
    const [visibility, setVisibility] = useState(language.visibility)

    const handleToggleFavorite = async () => {
        const newFavorite = !isFavorite
        setIsFavorite(newFavorite) // Optimistic update
        const result = await toggleLanguageFavoriteAction(language.id, newFavorite)
        if (result.error) {
            setIsFavorite(!newFavorite) // Revert
            toast.error(tForm('error'))
        }
    }

    const handleVisibilityChange = async (value: string) => {
        const oldVisibility = visibility
        setVisibility(value as any) // Optimistic update
        const result = await updateLanguageVisibilityAction(language.id, value)
        if (result.error) {
            setVisibility(oldVisibility) // Revert
            toast.error(tForm('error'))
        }
    }

    return (
        <Card className="overflow-hidden transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 border-b gap-4">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={handleToggleFavorite}
                    >
                        <Star className={cn("h-5 w-5", isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
                    </Button>
                    <div className="font-semibold text-base truncate">
                        {language.language}
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <Select value={visibility} onValueChange={handleVisibilityChange}>
                        <SelectTrigger className="h-8 w-[130px] bg-background">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public">
                                <div className="flex items-center gap-2">
                                    <Globe className="h-3 w-3" />
                                    <span>{tForm('visibilityPublic')}</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="trusted">
                                <div className="flex items-center gap-2">
                                    <Users className="h-3 w-3" />
                                    <span>{tForm('visibilityTrusted')}</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="private">
                                <div className="flex items-center gap-2">
                                    <Lock className="h-3 w-3" />
                                    <span>{tForm('visibilityPrivate')}</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(language)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(language)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="font-medium">
                            {tForm(language.level as any)}
                        </div>
                        {language.is_native && (
                            <div className="text-sm text-muted-foreground mt-1">
                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                    {tForm('isNative')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}
