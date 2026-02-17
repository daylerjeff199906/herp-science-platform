'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import {
    GeneralProfileSchema,
    AcademicProfileSchema,
    SecurityProfileSchema,
    GeneralProfileData,
    AcademicProfileData,
    SecurityProfileData,
} from '@/lib/schemas/profile'

export async function updateGeneralProfile(
    locale: string,
    data: GeneralProfileData
) {
    const result = GeneralProfileSchema.safeParse(data)

    if (!result.success) {
        console.error('Validation error:', result.error)
        return { error: 'Validation failed' }
    }

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    // Update profile
    // Fields to update in profiles table
    const profileUpdates: any = {
        updated_at: new Date().toISOString(),
        first_name: data.firstName,
        last_name: data.lastName,
        bio: data.bio,
        location: data.location,
        birth_date: data.birthDate,
        phone: data.phone,

        // Extended fields
        dedication: data.dedication,
        areas_of_interest: data.areasOfInterest,
        expertise_areas: data.expertiseAreas,
        research_interests: data.researchInterests,
        institution: data.institution,
    }

    const { error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id)

    if (error) {
        console.error('Error updating profile:', error)
        return { error: 'Failed to update profile' }
    }

    revalidatePath(`/${locale}/profile`, 'layout')
    return { success: true }
}

export async function updateAcademicProfile(
    locale: string,
    data: AcademicProfileData
) {
    const result = AcademicProfileSchema.safeParse(data)

    if (!result.success) {
        return { error: 'Validation failed' }
    }

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    const profileUpdates: any = {
        updated_at: new Date().toISOString(),
        institution: data.institution,
        dedication: data.dedication,
        current_position: data.currentPosition, // Schema uses currentPosition camelCase?
        // Check lib/schemas/onboarding.ts. ProfessionalInfoSchema: currentPosition.
        // Ensure DB uses snake_case: current_position.
        website: data.website,
        expertise_areas: data.expertiseAreas,
        research_interests: data.researchInterests,
    }

    const { error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id)

    if (error) {
        console.error('Error updating academic profile:', error)
        return { error: 'Failed to update profile' }
    }

    revalidatePath(`/${locale}/profile`, 'layout')
    return { success: true }
}

export async function updateSecurityProfile(
    locale: string,
    data: SecurityProfileData
) {
    const result = SecurityProfileSchema.safeParse(data)

    if (!result.success) {
        return { error: 'Validation failed' }
    }

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Update password if provided
    if (data.newPassword) {
        const { error } = await supabase.auth.updateUser({
            password: data.newPassword,
        })

        if (error) {
            console.error('Error updating password:', error)
            return { error: error.message }
        }
    }

    revalidatePath(`/${locale}/profile`, 'layout')
    return { success: true }
}

export async function updateSocialLinks(
    locale: string,
    links: any[]
) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('profiles')
        .update({
            social_links: links,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (error) {
        console.error('Error updating social links:', error)
        return { error: 'Failed to update social links' }
    }

    revalidatePath(`/${locale}/profile`, 'layout')
    return { success: true }
}

export async function updateAdditionalEmails(
    locale: string,
    emails: any[]
) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('profiles')
        .update({
            additional_emails: emails,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (error) {
        console.error('Error updating additional emails:', error)
        return { error: 'Failed to update emails' }
    }

    revalidatePath(`/${locale}/profile`, 'layout')
    return { success: true }
}
