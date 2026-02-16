'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const OnboardingSchema = z.object({
    institution: z.string().min(2, { message: "Institution name is required" }),
    degree: z.string().min(2, { message: "Degree is required" }),
    fieldOfStudy: z.string().min(2, { message: "Field of study is required" }),
})

export async function submitOnboarding(prevState: any, formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const validatedFields = OnboardingSchema.safeParse({
        institution: formData.get('institution'),
        degree: formData.get('degree'),
        fieldOfStudy: formData.get('fieldOfStudy'),
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

    // Check if profile exists (it should via trigger), but we are inserting into academic_profiles
    // We need the user's profile ID which is the same as auth ID.

    const { error } = await supabase
        .from('academic_profiles')
        .insert({
            user_id: user.id,
            institution: validatedFields.data.institution,
            degree: validatedFields.data.degree,
            field_of_study: validatedFields.data.fieldOfStudy,
        })

    if (error) {
        console.error(error)
        return {
            message: 'Database Error: Failed to Create Academic Profile.',
        }
    }

    // Update user metadata to indicate onboarding is complete if needed, 
    // or just rely on existence of academic_profile record. 
    // For simplicity, let's redirect.

    redirect('/dashboard?welcome=true')
}
