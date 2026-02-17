'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function createEmploymentAction(data: any | FormData) {
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

    const sanitizedPayload = {
        ...payload,
        user_id: user.id,
        city: payload.city || null,
        region_state: payload.region_state || null,
        country: payload.country || null,
        department: payload.department || null,
        scope: payload.scope || null,
        end_date: payload.end_date || null,
    }

    const { error } = await supabase.from('employment_history').insert(sanitizedPayload)

    if (error) {
        console.error('Error creating employment:', error)
        return { error: 'Error al crear la experiencia laboral' }
    }

    revalidatePath('/dashboard/profile/employment')
    return { success: true }
}

export async function updateEmploymentAction(id: string, data: any | FormData) {
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

    delete payload.user_id
    delete payload.id

    const sanitizedPayload = {
        ...payload,
        city: payload.city || null,
        region_state: payload.region_state || null,
        country: payload.country || null,
        department: payload.department || null,
        scope: payload.scope || null,
        end_date: payload.end_date || null,
    }

    const { error } = await supabase
        .from('employment_history')
        .update(sanitizedPayload)
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating employment:', error)
        return { error: 'Error al actualizar la experiencia laboral' }
    }

    revalidatePath('/dashboard/profile/employment')
    return { success: true }
}

export async function deleteEmploymentAction(id: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'No autorizado' }
    }

    const { error } = await supabase
        .from('employment_history')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting employment:', error)
        return { error: 'Error al eliminar la experiencia laboral' }
    }

    revalidatePath('/dashboard/profile/employment')
    return { success: true }
}
