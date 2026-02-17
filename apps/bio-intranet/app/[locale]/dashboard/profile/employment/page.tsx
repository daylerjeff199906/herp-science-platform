import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { EmploymentList } from '@/components/profile/employment-list'
import { Employment } from '@/types/employment'

export default async function EmploymentPage({
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

    const { data: employment, error } = await supabase
        .from('employment_history')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false })

    if (error) {
        console.error('Error fetching employment:', error)
    }

    return (
        <EmploymentList
            employmentList={(employment as Employment[]) || []}
            locale={locale}
        />
    )
}
