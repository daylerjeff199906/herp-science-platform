'use client'

import React, { useState } from 'react'
import { Language } from '@/types/language'
import { Card } from '@repo/ui'
import { useTranslations } from 'next-intl'
import { Edit, Trash2, Globe, Users, Lock, ChevronDown, ChevronUp, Star, GraduationCap } from 'lucide-react'
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

    if (languages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10 border-dashed">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{t('title')}</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-4">
                    {t('description')}
                </p>
                <LanguageCreateButton />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{t('title')}</h3>
                <LanguageCreateButton />
            </div>

            <div className="grid gap-4">
                {languages.map((language) => (
                    <LanguageItem
                        key={language.id}
                        language={language}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
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
            <Button onClick={() => setIsOpen(true)} variant="outline" size="sm">
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
        <Card className="overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary transition-all duration-300">
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
                            {tForm(`level.${language.level}` as any)}
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
