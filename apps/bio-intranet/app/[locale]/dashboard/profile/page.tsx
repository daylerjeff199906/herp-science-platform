import { Separator } from "@/components/ui/separator"
import { GeneralForm } from "@/components/profile/general-form"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { getTranslations } from "next-intl/server"

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

    const initialData = {
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        email: user.email || '',
        bio: profile?.bio || '',
        location: profile?.location || '',
        birthDate: profile?.birth_date || '',
        phone: profile?.phone || '',
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
                <GeneralForm initialData={initialData} locale={locale} />
            </div>
        </div>
    )
}
