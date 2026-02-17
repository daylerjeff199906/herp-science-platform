import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { EducationList } from '@/components/profile/education-list'
import { Education } from '@/types/education'

export default async function EducationPage({
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

    const { data: education, error } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false })

    if (error) {
        console.error('Error fetching education:', error)
    }

    return (
        <EducationList
            educationList={(education as Education[]) || []}
            locale={locale}
        />
    )
}
