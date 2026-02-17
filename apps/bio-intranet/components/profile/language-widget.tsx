'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import { Button } from '@/components/ui/button'
import { Edit, Globe } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Language } from '@/types/language'
import { ManageLanguagesModal } from './manage-languages-modal'

interface LanguageWidgetProps {
    languages?: Language[]
    locale: string
}

export function LanguageWidget({ languages = [], locale }: LanguageWidgetProps) {
    const t = useTranslations('Profile.language')
    const [isManageOpen, setIsManageOpen] = useState(false)

    // Sort by native or level?
    const sortedLanguages = [...languages].sort((a, b) => (b.is_native ? 1 : 0) - (a.is_native ? 1 : 0))

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold">
                        {t('title')}
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setIsManageOpen(true)} className="h-8 w-8 rounded-full bg-muted/50 hover:bg-muted">
                        <Edit className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    {sortedLanguages.length === 0 ? (
                        <p className="text-sm text-muted-foreground">{t('empty')}</p>
                    ) : (
                        <div className="space-y-3">
                            {sortedLanguages.slice(0, 3).map((lang) => (
                                <div key={lang.id} className="flex items-center justify-between py-1">
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">{lang.language}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {lang.is_native ? t('isNative') : (t(`level.${lang.level}`) || lang.level)}
                                    </span>
                                </div>
                            ))}
                            {sortedLanguages.length > 3 && (
                                <p className="text-xs text-muted-foreground text-center pt-2">
                                    +{sortedLanguages.length - 3} {t('more')}
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <ManageLanguagesModal
                isOpen={isManageOpen}
                onOpenChange={setIsManageOpen}
                languages={languages}
            />
        </>
    )
}
