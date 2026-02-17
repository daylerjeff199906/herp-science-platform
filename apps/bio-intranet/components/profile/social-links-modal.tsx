'use client'

import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@repo/ui'
import { Trash2, GripVertical, Plus, Globe, Lock, Users, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { updateSocialLinks } from '@/app/[locale]/dashboard/profile/actions'
import { toast } from 'sonner'
import { SocialLink } from '@/lib/schemas/profile-extensions'
import { Reorder, useDragControls } from 'framer-motion'

interface SocialLinksModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    initialLinks?: SocialLink[]
    locale: string
}

const DragItem = ({ link, index, updateLink, removeLink, t }: any) => {
    const controls = useDragControls()

    return (
        <Reorder.Item
            value={link}
            key={link.id}
            className="flex items-start gap-2 bg-background p-2 rounded-md border mb-2"
            dragListener={false}
            dragControls={controls}
        >
            <div
                className="mt-3 cursor-grab text-muted-foreground hover:text-foreground touch-none"
                onPointerDown={(e) => controls.start(e)}
            >
                <GripVertical className="h-4 w-4" />
            </div>

            <div className="flex-1 space-y-2">
                <Input
                    value={link.title}
                    onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                    placeholder={t('titlePlaceholder')}
                    className="h-9"
                />
                <Input
                    value={link.url}
                    onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                    placeholder={t('urlPlaceholder')}
                    className="h-9 text-xs"
                />
            </div>

            <div className="flex flex-col gap-2">
                <Select
                    value={link.visibility}
                    onValueChange={(val: string) => updateLink(link.id, 'visibility', val)}
                >
                    <SelectTrigger className="h-9 w-[110px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="public">
                            <div className="flex items-center gap-2">
                                <Globe className="h-3 w-3" />
                                <span className="text-xs">{t('public')}</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="trusted">
                            <div className="flex items-center gap-2">
                                <Users className="h-3 w-3" />
                                <span className="text-xs">{t('trusted')}</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="private">
                            <div className="flex items-center gap-2">
                                <Lock className="h-3 w-3" />
                                <span className="text-xs">{t('private')}</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10 self-end"
                    onClick={() => removeLink(link.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </Reorder.Item>
    )
}

export function SocialLinksModal({ isOpen, onOpenChange, initialLinks = [], locale }: SocialLinksModalProps) {
    const t = useTranslations('Profile.socialLinks')
    const [links, setLinks] = useState<SocialLink[]>(initialLinks)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setLinks(initialLinks)
        }
    }, [isOpen, initialLinks])

    const addLink = () => {
        const newLink: SocialLink = {
            id: crypto.randomUUID(),
            title: '',
            url: '',
            visibility: 'public',
            order: links.length
        }
        setLinks([...links, newLink])
    }

    const removeLink = (id: string) => {
        setLinks(links.filter(l => l.id !== id))
    }

    const updateLink = (id: string, field: keyof SocialLink, value: any) => {
        setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l))
    }

    const handleReorder = (newOrder: SocialLink[]) => {
        // Update order property based on index
        const ordered = newOrder.map((item, index) => ({ ...item, order: index }))
        setLinks(ordered)
    }

    const handleSubmit = async () => {
        // Basic validation
        if (links.some(l => !l.title || !l.url)) {
            toast.error(t('validationError'))
            return
        }

        setIsSubmitting(true)
        try {
            const result = await updateSocialLinks(locale, links)
            if (result.error) {
                toast.error(t('error'))
            } else {
                toast.success(t('success'))
                onOpenChange(false)
            }
        } catch (error) {
            toast.error(t('error'))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('modalTitle')}</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        {t('description')}
                    </p>

                    <h4 className="text-sm font-semibold mb-2">{t('myLinks')}</h4>

                    <Reorder.Group axis="y" values={links} onReorder={handleReorder} className="space-y-2">
                        {links.map((link, index) => (
                            <DragItem
                                key={link.id}
                                link={link}
                                index={index}
                                updateLink={updateLink}
                                removeLink={removeLink}
                                t={t}
                            />
                        ))}
                    </Reorder.Group>

                    <Button
                        variant="ghost"
                        className="mt-2 w-full justify-start text-primary hover:text-primary hover:bg-primary/5"
                        onClick={addLink}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {t('addLink')}
                    </Button>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        {t('cancel')}
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
