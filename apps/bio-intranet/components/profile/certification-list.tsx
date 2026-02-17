'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@repo/ui'
import { Button } from '@/components/ui/button'
import { Edit, Plus, Trash2, Award, ExternalLink, Calendar, Key } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Certification } from '@/types/certification'
import { CertificationModal } from './certification-modal'
import { DeleteCertificationDialog } from './certification-delete-dialog'
import { CertificationFormValues } from '@/lib/schemas/certification'
import { motion, AnimatePresence } from 'framer-motion'

interface CertificationListProps {
    certifications: Certification[]
}

const mapCertificationToFormValues = (cert: Certification): CertificationFormValues => {
    return {
        name: cert.name,
        issuing_organization: cert.issuing_organization,
        issue_date: cert.issue_date,
        expiration_date: cert.expiration_date,
        credential_id: cert.credential_id,
        credential_url: cert.credential_url,
        visibility: cert.visibility,
        is_favorite: cert.is_favorite,
        id: cert.id,
    }
}

export function CertificationList({ certifications }: CertificationListProps) {
    const t = useTranslations('Profile.certifications')
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null)

    const handleCreate = () => {
        setSelectedCertification(null)
        setIsEditOpen(true)
    }

    const handleEdit = (cert: Certification) => {
        setSelectedCertification(cert)
        setIsEditOpen(true)
    }

    const handleDelete = (cert: Certification) => {
        setSelectedCertification(cert)
        setIsDeleteOpen(true)
    }

    const handleSuccess = () => {
        setSelectedCertification(null)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">{t('title')}</h2>
                    <p className="text-muted-foreground">{t('description')}</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('form.add')}
                </Button>
            </div>

            <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                    {certifications.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <Card className="border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                                    <Award className="h-10 w-10 mb-4 opacity-20" />
                                    <h3 className="mt-2 text-lg font-semibold">{t('emptyStateTitle')}</h3>
                                    <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                                        {t('emptyStateDescription')}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        certifications.map((cert) => (
                            <motion.div
                                key={cert.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-lg">{cert.name}</h3>
                                                    {cert.credential_url && (
                                                        <a
                                                            href={cert.credential_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-muted-foreground hover:text-primary transition-colors"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </a>
                                                    )}
                                                </div>
                                                <div className="text-sm font-medium text-foreground">{cert.issuing_organization}</div>

                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-1">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        <span>Issued: {new Date(cert.issue_date).toLocaleDateString()}</span>
                                                    </div>
                                                    {cert.expiration_date && (
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            <span>Expires: {new Date(cert.expiration_date).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                    {cert.credential_id && (
                                                        <div className="flex items-center gap-1">
                                                            <Key className="h-3.5 w-3.5" />
                                                            <span>ID: {cert.credential_id}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(cert)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => handleDelete(cert)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <CertificationModal
                id={selectedCertification?.id}
                initialData={selectedCertification ? mapCertificationToFormValues(selectedCertification) : undefined}
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
                onSuccess={handleSuccess}
            />

            <DeleteCertificationDialog
                certification={selectedCertification}
                isOpen={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onSuccess={handleSuccess}
            />
        </div>
    )
}
