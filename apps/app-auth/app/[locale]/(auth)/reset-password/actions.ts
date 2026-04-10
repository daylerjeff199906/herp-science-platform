'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function resetPassword(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const password = formData.get('password') as string

    const { error } = await supabase.auth.updateUser({
        password: password,
    })

    if (error) {
        return { error: 'Could not reset password' }
    }

    redirect('/')
}
