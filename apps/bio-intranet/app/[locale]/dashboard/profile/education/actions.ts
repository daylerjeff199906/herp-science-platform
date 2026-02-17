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

    // Transform dates if necessary, ensure format
    const { error } = await supabase.from('education').insert({
        ...payload,
        user_id: user.id,
    })

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

    const { error } = await supabase
        .from('education')
        .update(payload)
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
