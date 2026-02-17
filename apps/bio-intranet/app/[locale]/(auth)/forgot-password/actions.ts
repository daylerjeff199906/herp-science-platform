'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getLocale } from 'next-intl/server';

export async function forgotPassword(formData: FormData) {
    const locale = await getLocale();
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const email = formData.get('email') as string

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3004'}/${locale}/auth/callback?next=/${locale}/reset-password`,
    })

    if (error) {
        return { error: 'Could not send reset email' }
    }

    return { success: 'Check your email for the reset link' }
}
