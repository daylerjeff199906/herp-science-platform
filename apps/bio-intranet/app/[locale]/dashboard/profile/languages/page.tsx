import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { LanguageList } from '@/components/profile/language-list'
import { Language } from '@/types/language'

export default async function LanguagesPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: languages, error } = await supabase
        .from('languages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching languages:', error)
    }

    return (
        <LanguageList
            languages={(languages as Language[]) || []}
        />
    )
}
