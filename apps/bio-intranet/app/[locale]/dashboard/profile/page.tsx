import { GeneralForm } from "@/components/profile/general-form"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { getTranslations } from "next-intl/server"
import { getActiveTopics, getInterestCategories } from "@/app/[locale]/onboarding/actions"

interface ProfileGeneralPageProps {
    params: Promise<{ locale: string }>
}

export default async function ProfileGeneralPage({ params }: ProfileGeneralPageProps) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Profile.general' })
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch complete profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch topics and categories for the form
    const [topics, interestCategories] = await Promise.all([
        getActiveTopics(locale),
        getInterestCategories(locale),
    ])

    const initialData = {
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        email: user.email || '',
        bio: profile?.bio || '',
        location: profile?.location || '',
        birthDate: profile?.birth_date || '',
        phone: profile?.phone || '',
        // Extended fields
        dedication: profile?.dedication || '',
        areasOfInterest: profile?.areas_of_interest || [],
        expertiseAreas: profile?.expertise_areas || [],
        researchInterests: profile?.research_interests || '',
        currentPosition: profile?.current_position || '',
        website: profile?.website || '',
        institution: profile?.institution || '',
        onboardingCompleted: profile?.onboarding_completed || false,
    }

    return (
        <GeneralForm
            initialData={initialData}
            locale={locale}
            topics={topics}
            interestCategories={interestCategories}
        />
    )
}
