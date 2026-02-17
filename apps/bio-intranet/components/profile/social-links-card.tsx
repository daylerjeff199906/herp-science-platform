'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import { Button } from '@/components/ui/button'
import { Edit, Eye, EyeOff, Globe, Lock, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { SocialLink } from '@/lib/schemas/profile-extensions'
import { SocialLinksModal } from './social-links-modal'

interface SocialLinksCardProps {
    links?: SocialLink[]
    locale: string
}

export function SocialLinksCard({ links = [], locale }: SocialLinksCardProps) {
    const t = useTranslations('Profile.socialLinks')
    const [isEditOpen, setIsEditOpen] = useState(false)

    // Sort by order 
    const sortedLinks = [...links].sort((a, b) => (a.order || 0) - (b.order || 0))

    const getVisibilityIcon = (visibility: string) => {
        switch (visibility) {
            case 'public': return <Globe className="h-4 w-4 text-green-600" />
            case 'trusted': return <Users className="h-4 w-4 text-blue-600" />
            default: return <Lock className="h-4 w-4 text-muted-foreground" />
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
                    {sortedLinks.length === 0 ? (
                        <p className="text-sm text-muted-foreground">{t('empty')}</p>
                    ) : (
                        <div className="space-y-3">
                            {sortedLinks.map((link) => (
                                <div key={link.id} className="flex items-center justify-between py-1">
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium hover:underline text-primary truncate max-w-[200px]"
                                    >
                                        {link.title}
                                    </a>
                                    <div className="flex items-center gap-2" title={link.visibility}>
                                        {getVisibilityIcon(link.visibility)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <SocialLinksModal
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
                initialLinks={links}
                locale={locale}
            />
        </>
    )
}
