import { Separator } from "@/components/ui/separator"
import { getTranslations } from "next-intl/server"

interface SettingsNotificationsPageProps {
    params: Promise<{ locale: string }>
}

export default async function SettingsNotificationsPage({ params }: SettingsNotificationsPageProps) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Profile.notifications' })

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
                <p>Notification settings coming soon.</p>
            </div>
        </div>
    )
}
