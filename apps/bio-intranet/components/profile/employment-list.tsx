'use client'

import React, { useState } from 'react'
import { Card } from '@repo/ui'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import {
    Plus,
    Briefcase,
    Pencil,
    Trash2,
    Building2,
    Edit
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { format } from 'date-fns'
import { Employment } from '@/types/employment'
import { EmploymentModal } from './employment-modal'
import { EmploymentDeleteDialog } from './employment-delete-dialog'

interface EmploymentListProps {
    employmentList: Employment[]
    locale: string
}

export function EmploymentList({ employmentList, locale }: EmploymentListProps) {
    const t = useTranslations('Profile.employment')
    const [selectedEmployment, setSelectedEmployment] = useState<Employment | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const handleCreate = () => {
        setSelectedEmployment(null)
        setIsModalOpen(true)
    }

    const handleEdit = (employment: Employment) => {
        setSelectedEmployment(employment)
        setIsModalOpen(true)
    }

    const handleDelete = (employment: Employment) => {
        setSelectedEmployment(employment)
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
                    {employmentList.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center p-8 border rounded-lg border-dashed text-center"
                        >
                            <div className="rounded-full bg-muted p-3 mb-4">
                                <Briefcase className="h-6 w-6 text-muted-foreground" />
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
                        employmentList.map((emp, index) => (
                            <motion.div
                                key={emp.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card>
                                    <div className="flex flex-row items-center justify-between p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 border rounded-lg bg-muted/30">
                                                <Briefcase className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <h3 className="font-semibold text-lg leading-none">
                                                    {emp.role}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Building2 className="h-3 w-3" />
                                                    <span>{emp.organization}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-x-2 text-xs text-muted-foreground mt-1">
                                                    <span>
                                                        {emp.start_date
                                                            ? format(new Date(emp.start_date), 'MMM yyyy')
                                                            : ''}{' '}
                                                        -{' '}
                                                        {emp.is_current
                                                            ? t('present')
                                                            : emp.end_date
                                                                ? format(new Date(emp.end_date), 'MMM yyyy')
                                                                : ''}
                                                    </span>
                                                    {emp.department && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{emp.department}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(emp)}>
                                                <Edit className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(emp)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )))}
                </AnimatePresence>
            </div>

            <EmploymentModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                id={selectedEmployment?.id}
                initialData={selectedEmployment as any}
                onSuccess={handleSuccess}
            />

            {selectedEmployment && (
                <EmploymentDeleteDialog
                    id={selectedEmployment.id}
                    isOpen={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    onSuccess={handleSuccess}
                />
            )}
        </>
    )
}
