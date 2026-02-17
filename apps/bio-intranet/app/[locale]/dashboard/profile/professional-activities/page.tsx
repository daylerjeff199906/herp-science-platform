import { ProfessionalActivityList } from '@/components/profile/professional-activity-list'
import { getProfessionalActivitiesAction } from './actions'
import { getTranslations } from 'next-intl/server'

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
        <ProfessionalActivityList activities={activities || []} />
    )
}
