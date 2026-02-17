import { GeneralForm } from "@/components/profile/general-form"
import { AvatarUpload } from "@/components/profile/avatar-upload"
import { SocialLinksCard } from "@/components/profile/social-links-card"
import { AdditionalEmailsCard } from "@/components/profile/additional-emails-card"
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

    // Fetch languages
    const { data: languages } = await supabase
        .from('languages')
        .select('*')
        .eq('user_id', user.id)
        .order('is_native', { ascending: false })

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                <GeneralForm
                    initialData={initialData}
                    locale={locale}
                    topics={topics}
                    interestCategories={interestCategories}
                />
            </div>
            <div className="space-y-6">
                <div className="bg-card rounded-lg border p-6 flex flex-col items-center text-center">
                    <AvatarUpload
                        avatarUrl={profile?.avatar_url}
                        firstName={profile?.first_name}
                        lastName={profile?.last_name}
                    />
                    <h3 className="mt-4 font-semibold text-lg">{profile?.first_name} {profile?.last_name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{profile?.bio}</p>
                </div>

                <SocialLinksCard links={profile?.social_links || []} locale={locale} />
                <AdditionalEmailsCard emails={profile?.additional_emails || []} locale={locale} />
            </div>
        </div>
    )
}
