'use server'

// getPresignedAvatarUrl removed as we use API route for upload now.

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function updateAvatar(url: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: url, updated_at: new Date().toISOString() })
        .eq('id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}
