'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function createEducationAction(data: any | FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'No autorizado' }
    }

    // If using FormData, parse it
    let payload = data
    if (data instanceof FormData) {
        payload = Object.fromEntries(data.entries())
    }

    // Ensure empty strings are converted to null for optional fields
    const sanitizedPayload = {
        ...payload,
        user_id: user.id,
        // Optional string fields
        city: payload.city || null,
        region_state: payload.region_state || null,
        country: payload.country || null,
        field_of_study: payload.field_of_study || null,
        degree: payload.degree || null,
        scope: payload.scope || null,
        end_date: payload.end_date || null,
        // start_date is required but if empty string, convert to null? Or let it fail if not provided?
        // Schema requires min(1), so it should be valid string. But if frontend sends '', convert to null and see if DB accepts/rejects.
        // Usually better to let it be string if it's there.
    }

    const { error } = await supabase.from('education').insert(sanitizedPayload)

    if (error) {
        console.error('Error creating education:', error)
        return { error: 'Error al crear la educación' }
    }

    revalidatePath('/dashboard/profile/education')
    return { success: true }
}

export async function updateEducationAction(id: string, data: any | FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'No autorizado' }
    }

    let payload = data
    if (data instanceof FormData) {
        payload = Object.fromEntries(data.entries())
    }

    // Remove user_id from payload just in case
    delete payload.user_id
    delete payload.id

    const sanitizedPayload = {
        ...payload,
        // Optional string fields
        city: payload.city || null,
        region_state: payload.region_state || null,
        country: payload.country || null,
        field_of_study: payload.field_of_study || null,
        degree: payload.degree || null,
        scope: payload.scope || null,
        end_date: payload.end_date || null,
    }

    const { error } = await supabase
        .from('education')
        .update(sanitizedPayload)
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating education:', error)
        return { error: 'Error al actualizar la educación' }
    }

    revalidatePath('/dashboard/profile/education')
    return { success: true }
}

export async function deleteEducationAction(id: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'No autorizado' }
    }

    const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting education:', error)
        return { error: 'Error al eliminar la educación' }
    }

    revalidatePath('/dashboard/profile/education')
    return { success: true }
}
