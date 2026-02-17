import { Separator } from "@/components/ui/separator"
import { SecurityForm } from "@/components/profile/security-form"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { getTranslations } from "next-intl/server"

interface ProfileSecurityPageProps {
    params: Promise<{ locale: string }>
}

export default async function ProfileSecurityPage({ params }: ProfileSecurityPageProps) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Profile.security' })
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

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
                <SecurityForm email={user.email || ''} locale={locale} />
            </div>
        </div>
    )
}
