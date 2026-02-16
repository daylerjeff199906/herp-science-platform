'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
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
            redirect('/dashboard')
            return
        }

        // Si no ha completado el onboarding, redirigir a onboarding
        if (!profile?.onboarding_completed) {
            revalidatePath('/', 'layout')
            redirect('/onboarding')
            return
        }
    }

    // Si ha completado el onboarding, redirigir al dashboard
    revalidatePath('/', 'layout')
    redirect('/dashboard')
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
