'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const OnboardingSchema = z.object({
    institution: z.string().min(2, { message: "Institution name is required" }),
    degree: z.string().min(2, { message: "Degree is required" }),
    fieldOfStudy: z.string().min(2, { message: "Field of study is required" }),
    bio: z.string().optional(),
    birthYear: z.coerce.number().min(1900).max(new Date().getFullYear()).optional(),
})

export async function submitOnboarding(prevState: any, formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const validatedFields = OnboardingSchema.safeParse({
        institution: formData.get('institution'),
        degree: formData.get('degree'),
        fieldOfStudy: formData.get('fieldOfStudy'),
        bio: formData.get('bio'),
        birthYear: formData.get('birthYear'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Insert academic profile
    const { error: academicError } = await supabase
        .from('academic_profiles')
        .insert({
            user_id: user.id,
            institution: validatedFields.data.institution,
            degree: validatedFields.data.degree,
            field_of_study: validatedFields.data.fieldOfStudy,
            bio: validatedFields.data.bio,
        })

    if (academicError) {
        console.error('Academic profile error:', academicError)
        return {
            message: 'Database Error: Failed to Create Academic Profile.',
        }
    }

    // Update profile with bio, birth_year and mark onboarding as completed
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            bio: validatedFields.data.bio,
            birth_year: validatedFields.data.birthYear,
            onboarding_completed: true,
        })
        .eq('id', user.id)

    if (profileError) {
        console.error('Profile update error:', profileError)
        return {
            message: 'Database Error: Failed to Update Profile.',
        }
    }

    redirect('/dashboard?welcome=true')
}
