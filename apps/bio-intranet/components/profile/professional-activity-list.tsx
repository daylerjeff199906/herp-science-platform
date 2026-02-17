'use client'

import React, { useState } from 'react'
import { ProfessionalActivity } from '@/types/professional-activity'
import { Card } from '@repo/ui'
import { useTranslations } from 'next-intl'
import { Edit, Trash2, Globe, Users, Lock, Star, Building2, MapPin, CalendarDays, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProfessionalActivityModal } from './professional-activity-modal'
import { DeleteProfessionalActivityDialog } from './professional-activity-delete-dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@repo/ui'
import { toggleProfessionalActivityFavoriteAction, updateProfessionalActivityVisibilityAction } from '@/app/[locale]/dashboard/profile/professional-activities/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ProfessionalActivityListProps {
    activities: ProfessionalActivity[]
}

export function ProfessionalActivityList({ activities }: ProfessionalActivityListProps) {
    const t = useTranslations('Profile.professionalActivity')
    const [selectedActivity, setSelectedActivity] = useState<ProfessionalActivity | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const handleEdit = (activity: ProfessionalActivity) => {
        setSelectedActivity(activity)
        setIsEditOpen(true)
    }

    const handleDelete = (activity: ProfessionalActivity) => {
        setSelectedActivity(activity)
        setIsDeleteOpen(true)
    }

    const handleSuccess = () => {
        setSelectedActivity(null)
    }

    if (activities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10 border-dashed">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{t('title')}</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-4">
                    {t('description')}
                </p>
                <ProfessionalActivityCreateButton />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{t('title')}</h3>
                <ProfessionalActivityCreateButton />
            </div>

            <div className="grid gap-4">
                {activities.map((activity) => (
                    <ProfessionalActivityItem
                        key={activity.id}
                        activity={activity}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            <ProfessionalActivityModal
                id={selectedActivity?.id}
                initialData={selectedActivity ? {
                    ...selectedActivity,
                    city: selectedActivity.city || undefined,
                    region_state: selectedActivity.region_state || undefined,
                    country: selectedActivity.country || undefined,
                    scope: selectedActivity.scope || undefined,
                    end_date: selectedActivity.end_date || undefined,
                    activity_type: selectedActivity.activity_type as string,
                    is_current: selectedActivity.is_current,
                    role: selectedActivity.role,
                    start_date: selectedActivity.start_date,
                    visibility: selectedActivity.visibility,
                    organization: selectedActivity.organization,
                    is_favorite: selectedActivity.is_favorite || undefined
                } : undefined}
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
                onSuccess={handleSuccess}
            />

            <DeleteProfessionalActivityDialog
                activity={selectedActivity}
                isOpen={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onSuccess={handleSuccess}
            />
        </div>
    )
}

function ProfessionalActivityCreateButton() {
    const t = useTranslations('Profile.professionalActivity')
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setIsOpen(true)} variant="outline" size="sm">
                {t('add')}
            </Button>
            <ProfessionalActivityModal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                onSuccess={() => { }}
            />
        </>
    )
}

interface ProfessionalActivityItemProps {
    activity: ProfessionalActivity
    onEdit: (activity: ProfessionalActivity) => void
    onDelete: (activity: ProfessionalActivity) => void
}

function ProfessionalActivityItem({ activity, onEdit, onDelete }: ProfessionalActivityItemProps) {
    const tForm = useTranslations('Profile.professionalActivity.form')
    const tTypes = useTranslations('Profile.professionalActivity.types')
    const [isFavorite, setIsFavorite] = useState(activity.is_favorite || false)
    const [visibility, setVisibility] = useState(activity.visibility)

    const handleToggleFavorite = async () => {
        const newFavorite = !isFavorite
        setIsFavorite(newFavorite) // Optimistic update
        const result = await toggleProfessionalActivityFavoriteAction(activity.id, newFavorite)
        if (result.error) {
            setIsFavorite(!newFavorite) // Revert
            toast.error(tForm('error'))
        }
    }

    const handleVisibilityChange = async (value: string) => {
        const oldVisibility = visibility
        setVisibility(value as any) // Optimistic update
        const result = await updateProfessionalActivityVisibilityAction(activity.id, value)
        if (result.error) {
            setVisibility(oldVisibility) // Revert
            toast.error(tForm('error'))
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    }

    const locationString = [activity.city, activity.region_state, activity.country].filter(Boolean).join(', ')

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
                    <div className="min-w-0">
                        <div className="font-semibold text-base truncate">
                            {activity.organization}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Building2 className="h-3 w-3" />
                            {tTypes(activity.activity_type as any)}
                        </div>
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
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(activity)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(activity)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-4 grid gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                    <div className="font-medium text-sm text-muted-foreground">{tForm('role')}</div>
                    <div>{activity.role}</div>
                </div>
                <div className="space-y-1">
                    <div className="font-medium text-sm text-muted-foreground">{tForm('scope')}</div>
                    <div>{activity.scope || '-'}</div>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-1 font-medium text-sm text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        {tForm('startDate')} - {tForm('endDate')}
                    </div>
                    <div className="text-sm">
                        {formatDate(activity.start_date)} - {activity.is_current ? tForm('current') : (activity.end_date ? formatDate(activity.end_date) : '')}
                    </div>
                </div>
                {locationString && (
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 font-medium text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {tForm('city')} / {tForm('country')}
                        </div>
                        <div className="text-sm">{locationString}</div>
                    </div>
                )}
            </div>
        </Card>
    )
}
