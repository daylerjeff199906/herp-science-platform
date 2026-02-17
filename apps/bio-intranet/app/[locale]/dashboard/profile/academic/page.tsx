import { Separator } from "@/components/ui/separator"
import { AcademicForm } from "@/components/profile/academic-form"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { getTranslations } from "next-intl/server"

interface ProfileAcademicPageProps {
    params: Promise<{ locale: string }>
}

export default async function ProfileAcademicPage({ params }: ProfileAcademicPageProps) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Profile.academic' })
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const initialData = {
        institution: profile?.institution || '',
        dedication: profile?.dedication,
        currentPosition: profile?.current_position || '',
        website: profile?.website || '',
        expertiseAreas: profile?.expertise_areas || [],
        researchInterests: profile?.research_interests || '',
        areasOfInterest: profile?.areas_of_interest || [],
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
            <div className="max-w-xl">
                <AcademicForm initialData={initialData} locale={locale} />
            </div>
        </div>
    )
}
