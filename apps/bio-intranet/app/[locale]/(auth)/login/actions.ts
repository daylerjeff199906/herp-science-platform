'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

type LoginResponse = {
    error?: string
    redirectUrl?: string
}

export async function login(formData: FormData, locale: string = 'es'): Promise<LoginResponse> {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    // Verificar si el usuario ha completado el onboarding
    if (data.user) {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', data.user.id)
            .single()

        if (profileError) {
            console.error('Error fetching profile:', profileError)
            revalidatePath('/', 'layout')
            return { redirectUrl: `/${locale}/dashboard` }
        }


        // Si no ha completado el onboarding, redirigir a onboarding
        if (!profile?.onboarding_completed) {
            revalidatePath('/', 'layout')
            return { redirectUrl: `/${locale}/onboarding` }
        }
    }


    // Si ha completado el onboarding, redirigir al dashboard
    revalidatePath('/', 'layout')
    return { redirectUrl: `/${locale}/dashboard` }
}

export async function signup(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signout() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/login')
}
