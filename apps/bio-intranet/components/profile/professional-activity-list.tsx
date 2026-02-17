'use client'

import React, { useState } from 'react'
import { ProfessionalActivity } from '@/types/professional-activity'
import { Card } from '@repo/ui'
import { useTranslations } from 'next-intl'
import { Edit, Trash2, Globe, Users, Lock, Star, Building2, MapPin, CalendarDays, Award, Plus } from 'lucide-react'
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
import { AnimatePresence, motion } from 'framer-motion'
import { ProfessionalActivityFormValues } from '@/lib/schemas/professional-activity'

// Helper for mapping ProfessionalActivity to FormValues
const mapActivityToFormValues = (activity: ProfessionalActivity): ProfessionalActivityFormValues => ({
    ...activity,
    city: activity.city || undefined,
    region_state: activity.region_state || undefined,
    country: activity.country || undefined,
    scope: activity.scope || undefined,
    end_date: activity.end_date || undefined,
    activity_type: activity.activity_type as string,
    is_current: activity.is_current,
    role: activity.role,
    start_date: activity.start_date,
    visibility: activity.visibility,
    organization: activity.organization,
    is_favorite: activity.is_favorite || undefined
})

interface ProfessionalActivityListProps {
    activities: ProfessionalActivity[]
}

export function ProfessionalActivityList({ activities }: ProfessionalActivityListProps) {
    const t = useTranslations('Profile.professionalActivity')
    const [selectedActivity, setSelectedActivity] = useState<ProfessionalActivity | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const handleCreate = () => {
        setSelectedActivity(null)
        setIsEditOpen(true)
    }

    const handleEdit = (activity: ProfessionalActivity) => {
        setSelectedActivity(activity)
        setIsEditOpen(true)
    }

    const handleDelete = (activity: ProfessionalActivity) => {
        setSelectedActivity(activity)
        setIsDeleteOpen(true)
    }

    const handleSuccess = () => {
        setIsEditOpen(false)
        setIsDeleteOpen(false)
        setSelectedActivity(null)
    }

    return (
        <div className="space-y-6 ">
            <div className="flex justify-between items-center">
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
                    {activities.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center p-8 border rounded-lg border-dashed text-center"
                        >
                            <div className="rounded-full bg-muted p-3 mb-4">
                                <Award className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-lg font-medium">{t('title')}</p>
                            <p className="text-sm text-muted-foreground mt-1 max-w-sm mb-4">
                                {t('description')}
                            </p>
                            <Button variant="outline" onClick={handleCreate}>
                                <Plus className="mr-2 h-4 w-4" />
                                {t('add')}
                            </Button>
                        </motion.div>
                    ) : (
                        activities.map((activity, index) => (
                            <ProfessionalActivityItem
                                key={activity.id}
                                activity={activity}
                                index={index}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>

            <ProfessionalActivityModal
                id={selectedActivity?.id}
                initialData={selectedActivity ? mapActivityToFormValues(selectedActivity) : undefined}
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

interface ProfessionalActivityItemProps {
    activity: ProfessionalActivity
    index: number
    onEdit: (activity: ProfessionalActivity) => void
    onDelete: (activity: ProfessionalActivity) => void
}

function ProfessionalActivityItem({ activity, index, onEdit, onDelete }: ProfessionalActivityItemProps) {
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.1 }}
        >
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
        </motion.div>
    )
}
