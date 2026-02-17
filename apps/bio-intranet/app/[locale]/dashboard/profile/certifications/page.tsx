import React from 'react'
import { getCertificationsAction } from './actions'
import { CertificationList } from '@/components/profile/certification-list'
import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-dynamic'

export default async function CertificationsPage() {
    const certifications = await getCertificationsAction()
    const t = await getTranslations('Profile.certifications')

    return (
        <CertificationList certifications={certifications as any} />
    )
}
