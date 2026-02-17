'use server'

import { createClient } from '@/utils/supabase/server'
import { ProfessionalActivityFormValues } from '@/lib/schemas/professional-activity'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function getProfessionalActivitiesAction() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { data, error } = await supabase
        .from('professional_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('is_current', { ascending: false })
        .order('start_date', { ascending: false })

    if (error) {
        return { error: error.message }
    }

    return { data }
}

export async function createProfessionalActivityAction(data: ProfessionalActivityFormValues) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase.from('professional_activities').insert({
        user_id: user.id,
        organization: data.organization,
        activity_type: data.activity_type,
        role: data.role,
        city: data.city || null,
        region_state: data.region_state || null,
        country: data.country || null,
        start_date: data.start_date,
        end_date: data.end_date || null,
        is_current: data.is_current,
        scope: data.scope || null,
        visibility: data.visibility || 'public',
        is_favorite: data.is_favorite || false,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/[locale]/dashboard/profile/professional-activities', 'page')
    return { success: true }
}

export async function updateProfessionalActivityAction(id: string, data: ProfessionalActivityFormValues) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('professional_activities')
        .update({
            organization: data.organization,
            activity_type: data.activity_type,
            role: data.role,
            city: data.city || null,
            region_state: data.region_state || null,
            country: data.country || null,
            start_date: data.start_date,
            end_date: data.end_date || null,
            is_current: data.is_current,
            scope: data.scope || null,
            visibility: data.visibility || 'public',
            is_favorite: data.is_favorite,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/[locale]/dashboard/profile/professional-activities', 'page')
    return { success: true }
}

export async function deleteProfessionalActivityAction(id: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('professional_activities')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/[locale]/dashboard/profile/professional-activities', 'page')
    return { success: true }
}

export async function toggleProfessionalActivityFavoriteAction(id: string, is_favorite: boolean) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('professional_activities')
        .update({ is_favorite })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/[locale]/dashboard/profile/professional-activities', 'page')
    return { success: true }
}

export async function updateProfessionalActivityVisibilityAction(id: string, visibility: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('professional_activities')
        .update({ visibility })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/[locale]/dashboard/profile/professional-activities', 'page')
    return { success: true }
}
