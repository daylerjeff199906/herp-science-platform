'use client'

import React, { useState } from 'react'
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
    CardContent
} from '@repo/ui'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { useTranslations } from 'next-intl'
import {
    MoreVertical,
    Plus,
    BookOpen,
    Calendar,
    Building2,
    GraduationCap
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
                                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                        <div className="gap-1 flex flex-col">
                                            <CardTitle className="text-base font-semibold">
                                                {edu.title}
                                            </CardTitle>
                                            <CardDescription className="text-sm">
                                                {edu.institution}
                                            </CardDescription>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleEdit(edu)}>
                                                    {t('edit')}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDelete(edu)}
                                                >
                                                    {t('delete')}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Building2 className="h-4 w-4" />
                                                <span>{edu.field_of_study || t('noFieldOfStudy')}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <GraduationCap className="h-4 w-4" />
                                                <span>{edu.degree || t('noDegree')}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
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
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <BookOpen className="h-4 w-4" />
                                                <span className="capitalize">{t(`status.${edu.status}`)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
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
