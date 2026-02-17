'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { CertificationFormValues } from '@/lib/schemas/certification'
import { Certification } from '@/types/certification'

export async function getCertificationsAction() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('user_id', user.id)
        .order('issue_date', { ascending: false })

    if (error) {
        console.error('Error fetching certifications:', error)
        return []
    }

    return data as Certification[]
}

export async function createCertificationAction(data: CertificationFormValues) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('certifications')
        .insert({
            user_id: user.id,
            name: data.name,
            issuing_organization: data.issuing_organization,
            issue_date: data.issue_date,
            expiration_date: data.expiration_date || null,
            credential_id: data.credential_id || null,
            credential_url: data.credential_url || null,
            visibility: data.visibility || 'public',
            is_favorite: data.is_favorite || false,
        })

    if (error) {
        console.error('Error creating certification:', error)
        return { error: 'Error creating certification' }
    }

    revalidatePath('/[locale]/dashboard/profile', 'layout')
    return { success: true }
}

export async function updateCertificationAction(id: string, data: CertificationFormValues) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('certifications')
        .update({
            name: data.name,
            issuing_organization: data.issuing_organization,
            issue_date: data.issue_date,
            expiration_date: data.expiration_date || null,
            credential_id: data.credential_id || null,
            credential_url: data.credential_url || null,
            visibility: data.visibility,
            is_favorite: data.is_favorite,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating certification:', error)
        return { error: 'Error updating certification' }
    }

    revalidatePath('/[locale]/dashboard/profile', 'layout')
    return { success: true }
}

export async function deleteCertificationAction(id: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting certification:', error)
        return { error: 'Error deleting certification' }
    }

    revalidatePath('/[locale]/dashboard/profile', 'layout')
    return { success: true }
}

export async function toggleCertificationFavoriteAction(id: string, is_favorite: boolean) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('certifications')
        .update({ is_favorite, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error toggling favorite:', error)
        return { error: 'Error toggling favorite' }
    }

    revalidatePath('/[locale]/dashboard/profile', 'layout')
    return { success: true }
}

export async function updateCertificationVisibilityAction(id: string, visibility: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('certifications')
        .update({ visibility, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating visibility:', error)
        return { error: 'Error updating visibility' }
    }

    revalidatePath('/[locale]/dashboard/profile', 'layout')
    return { success: true }
}
