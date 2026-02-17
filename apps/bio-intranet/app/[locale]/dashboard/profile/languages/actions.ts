'use server'

import { createClient } from '@/utils/supabase/server'
import { LanguageFormValues } from '@/lib/schemas/language'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function getLanguagesAction() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { data, error } = await supabase
        .from('languages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        return { error: error.message }
    }

    return { data }
}

export async function createLanguageAction(data: LanguageFormValues) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase.from('languages').insert({
        user_id: user.id,
        language: data.language,
        level: data.level,
        is_native: data.is_native,
        visibility: data.visibility || 'public',
        is_favorite: data.is_favorite || false,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/[locale]/dashboard/profile/languages', 'page')
    return { success: true }
}

export async function updateLanguageAction(id: string, data: LanguageFormValues) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('languages')
        .update({
            language: data.language,
            level: data.level,
            is_native: data.is_native,
            visibility: data.visibility,
            is_favorite: data.is_favorite,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/[locale]/dashboard/profile/languages', 'page')
    return { success: true }
}

export async function deleteLanguageAction(id: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('languages')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/[locale]/dashboard/profile/languages', 'page')
    return { success: true }
}

export async function toggleLanguageFavoriteAction(id: string, is_favorite: boolean) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('languages')
        .update({ is_favorite })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/[locale]/dashboard/profile/languages', 'page')
    return { success: true }
}

export async function updateLanguageVisibilityAction(id: string, visibility: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('languages')
        .update({ visibility })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/[locale]/dashboard/profile/languages', 'page')
    return { success: true }
}
