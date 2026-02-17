'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import { Button } from '@/components/ui/button'
import { Edit, Mail, Lock, Globe, Users, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { AdditionalEmail } from '@/lib/schemas/profile-extensions'
import { AdditionalEmailsModal } from './additional-emails-modal'

interface AdditionalEmailsCardProps {
    emails?: AdditionalEmail[]
    locale: string
}

export function AdditionalEmailsCard({ emails = [], locale }: AdditionalEmailsCardProps) {
    const t = useTranslations('Profile.additionalEmails')
    const [isEditOpen, setIsEditOpen] = useState(false)

    const getVisibilityIcon = (visibility: string) => {
        switch (visibility) {
            case 'public': return <Globe className="h-4 w-4 text-green-600" />
            case 'trusted': return <Users className="h-4 w-4 text-blue-600" />
            default: return <EyeOff className="h-4 w-4 text-destructive" />
        }
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold">
                        {t('title')}
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditOpen(true)} className="h-8 w-8 rounded-full bg-muted/50 hover:bg-muted">
                        <Edit className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    {emails.length === 0 ? (
                        <p className="text-sm text-muted-foreground">{t('empty')}</p>
                    ) : (
                        <div className="space-y-3">
                            {emails.map((email) => (
                                <div key={email.id} className="flex items-center justify-between py-1">
                                    <div className="flex items-center gap-2 max-w-[200px] truncate">
                                        <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                                        <span className="text-sm font-medium">{email.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2" title={email.visibility}>
                                        {getVisibilityIcon(email.visibility)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <AdditionalEmailsModal
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
                initialEmails={emails}
                locale={locale}
            />
        </>
    )
}
