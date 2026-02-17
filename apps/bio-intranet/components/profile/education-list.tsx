'use client'

import React, { useState } from 'react'
import {
    Card,
} from '@repo/ui'
import { Button } from '@/components/ui/button'

import { useTranslations } from 'next-intl'
import {
    Plus,
    GraduationCap,
    Trash2,
    Edit
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { format } from 'date-fns'
import { Education } from '@/types/education'
import { EducationModal } from './education-modal'
import { EducationDeleteDialog } from './education-delete-dialog'

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
                            <motion.div
                                key={edu.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card>
                                    <div className="flex flex-row items-center justify-between p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 border rounded-lg bg-muted/30">
                                                <GraduationCap className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <h3 className="font-semibold text-lg leading-none">
                                                    {edu.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {edu.institution}
                                                </p>
                                                <div className="flex flex-wrap gap-x-2 text-xs text-muted-foreground mt-1">
                                                    <span>
                                                        {edu.start_date
                                                            ? format(new Date(edu.start_date), 'MMM yyyy')
                                                            : ''}{' '}
                                                        -{' '}
                                                        {edu.is_current
                                                            ? t('present')
                                                            : edu.end_date
                                                                ? format(new Date(edu.end_date), 'MMM yyyy')
                                                                : ''}
                                                    </span>
                                                    {(edu.degree || edu.field_of_study) && (
                                                        <>
                                                            <span>•</span>
                                                            <span>
                                                                {[edu.degree, edu.field_of_study].filter(Boolean).join(' - ')}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(edu)}>
                                                <Edit className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(edu)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
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
