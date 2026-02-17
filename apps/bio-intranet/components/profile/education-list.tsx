'use client'

import React, { useState } from 'react'
import {
    Card,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@repo/ui'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import {
    Plus,
    GraduationCap,
    Edit,
    Trash2,
    Star,
    Globe,
    Users,
    Lock,
    ChevronDown,
    ChevronUp
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { format } from 'date-fns'
import { Education } from '@/types/education'
import { EducationModal } from './education-modal'
import { EducationDeleteDialog } from './education-delete-dialog'
import { toggleEducationFavoriteAction, updateEducationVisibilityAction } from '@/app/[locale]/dashboard/profile/education/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface EducationListProps {
    educationList: Education[]
    locale: string
}

export function EducationList({ educationList, locale }: EducationListProps) {
    const t = useTranslations('Profile.education')
    const [selectedEducation, setSelectedEducation] = useState<Education | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const handleCreate = () => {
        setSelectedEducation(null)
        setIsModalOpen(true)
    }

    const handleEdit = (education: Education) => {
        setSelectedEducation(education)
        setIsModalOpen(true)
    }

    const handleDelete = (education: Education) => {
        setSelectedEducation(education)
        setIsDeleteDialogOpen(true)
    }

    const handleSuccess = () => {
        setIsModalOpen(false)
        setIsDeleteDialogOpen(false)
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">{t('title')}</h2>
                    <p className="text-muted-foreground">{t('description')}</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('add')}
                </Button>
            </div>

            <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                    {educationList.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center p-8 border rounded-lg border-dashed text-center"
                        >
                            <div className="rounded-full bg-muted p-3 mb-4">
                                <GraduationCap className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-lg font-medium">{t('emptyStateTitle')}</p>
                            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                                {t('emptyStateDescription')}
                            </p>
                            <Button variant="outline" className="mt-4" onClick={handleCreate}>
                                {t('addFirst')}
                            </Button>
                        </motion.div>
                    ) : (
                        educationList.map((edu, index) => (
                            <EducationItem
                                key={edu.id}
                                edu={edu}
                                index={index}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                t={t}
                            />
                        )))}
                </AnimatePresence>
            </div>

            <EducationModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                id={selectedEducation?.id}
                initialData={selectedEducation as any}
                onSuccess={handleSuccess}
            />

            {selectedEducation && (
                <EducationDeleteDialog
                    id={selectedEducation.id}
                    isOpen={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    onSuccess={handleSuccess}
                />
            )}
        </>
    )
}

function EducationItem({
    edu,
    index,
    onEdit,
    onDelete,
    t
}: {
    edu: Education
    index: number
    onEdit: (edu: Education) => void
    onDelete: (edu: Education) => void
    t: any
}) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isFavorite, setIsFavorite] = useState(edu.is_favorite)
    const [visibility, setVisibility] = useState(edu.visibility)

    const handleToggleFavorite = async () => {
        const newFavorite = !isFavorite
        setIsFavorite(newFavorite) // Optimistic update
        const result = await toggleEducationFavoriteAction(edu.id, newFavorite)
        if (result.error) {
            setIsFavorite(!newFavorite) // Revert
            toast.error(t('error'))
        }
    }

    const handleVisibilityChange = async (value: string) => {
        const oldVisibility = visibility
        setVisibility(value as any) // Optimistic
        const result = await updateEducationVisibilityAction(edu.id, value)
        if (result.error) {
            setVisibility(oldVisibility)
            toast.error(t('error'))
        }
    }


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className="overflow-hidden">
                {/* Header */}
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
                            {edu.institution}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <Select value={visibility} onValueChange={handleVisibilityChange}>
                            <SelectTrigger className="h-8 w-[130px] bg-background">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="public">
                                    <div className="flex items-center gap-2 truncate">
                                        <div>
                                            <Globe className="h-3 w-3" />
                                        </div>
                                        <span>{t('form.visibilityPublic')}</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="trusted">
                                    <div className="flex items-center gap-2 truncate">
                                        <div>
                                            <Users className="h-3 w-3" />
                                        </div>
                                        <span>{t('form.visibilityTrusted')}</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="private">
                                    <div className="flex items-center gap-2 truncate">
                                        <div>
                                            <Lock className="h-3 w-3" />
                                        </div>
                                        <span>{t('form.visibilityPrivate')}</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <div className='flex gap-2'>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(edu)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(edu)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="font-medium">
                                {edu.degree}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {[edu.field_of_study, edu.city, edu.region_state, edu.country].filter(Boolean).join(' - ')}
                            </div>
                        </div>
                        <Button
                            variant="link"
                            className="h-auto p-0 text-primary"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? t('showLess') || 'Show less' : t('showMore') || 'Show more details'}
                        </Button>
                    </div>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mt-4 text-sm space-y-2"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="font-semibold block">{t('form.dateLabel') || 'Dates'}:</span>
                                        <span className="text-muted-foreground">
                                            {edu.start_date ? format(new Date(edu.start_date), 'MMM yyyy') : ''} - {edu.is_current ? t('present') : (edu.end_date ? format(new Date(edu.end_date), 'MMM yyyy') : '')}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-semibold block">{t('form.status')}:</span>
                                        <span className="text-muted-foreground capitalize">{t(`status.${edu.status}`)}</span>
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <span className="font-semibold block">{t('added') || 'Added'}:</span>
                                        <span className="text-muted-foreground">{format(new Date(edu.created_at), 'yyyy-MM-dd')}</span>
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <span className="font-semibold block">{t('modified') || 'Last Modified'}:</span>
                                        <span className="text-muted-foreground">{format(new Date(edu.updated_at), 'yyyy-MM-dd')}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Card>
        </motion.div>
    )
}
