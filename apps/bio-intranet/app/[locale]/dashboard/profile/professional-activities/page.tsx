import { ProfessionalActivityList } from '@/components/profile/professional-activity-list'
import { getProfessionalActivitiesAction } from './actions'
import { getTranslations } from 'next-intl/server'
import { Separator } from '@/components/ui/separator'

interface ProfessionalActivitiesPageProps {
    params: Promise<{ locale: string }>
}

export default async function ProfessionalActivitiesPage({ params }: ProfessionalActivitiesPageProps) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Profile.professionalActivity' })
    const { data: activities, error } = await getProfessionalActivitiesAction()

    if (error) {
        return <div>Error loading activities</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-medium">{t('title')}</h3>
                <p className="text-sm text-muted-foreground">
                    {t('description')}
                </p>
            </div>
            <Separator />
            <ProfessionalActivityList activities={activities || []} />
        </div>
    )
}
