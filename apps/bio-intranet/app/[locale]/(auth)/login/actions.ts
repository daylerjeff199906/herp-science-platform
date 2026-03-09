'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

type LoginResponse = {
    error?: string
    redirectUrl?: string
}

// Helper: resolves the final redirect URL handling locale prefix correctly
function resolveRedirect(path: string | null | undefined, fallback: string, locale: string): string {
    if (!path) return fallback
    if (path.startsWith('http')) return path
    const knownLocales = ['es', 'en', 'pt']
    const segments = path.split('/').filter(Boolean)
    const firstSegment = segments[0] ?? ''
    if (knownLocales.includes(firstSegment)) return path
    // Missing locale prefix — prepend it
    return `/${locale}${path.startsWith('/') ? path : '/' + path}`
}

export async function login(formData: FormData, locale: string = 'es', redirectTo?: string | null): Promise<LoginResponse> {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    console.log(error, data)

    if (error) {
        return { error: error.message }
    }

    // Verificar si el usuario ha completado el onboarding
    if (data.user) {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('auth_id', data.user.id)
            .single()

        if (profileError) {
            console.error('Error fetching profile:', profileError)
            revalidatePath('/', 'layout')
            return { redirectUrl: resolveRedirect(redirectTo, `/${locale}/dashboard`, locale) }
        }

        // Si no ha completado el onboarding, redirigir a onboarding
        if (!profile?.onboarding_completed) {
            revalidatePath('/', 'layout')
            return { redirectUrl: `/${locale}/onboarding` }
        }
    }

    revalidatePath('/', 'layout')
    return { redirectUrl: resolveRedirect(redirectTo, `/${locale}/dashboard`, locale) }
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

export async function signout(redirectTo?: string, locale: string = 'es') {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')

    if (redirectTo) {
        redirect(`/${locale}/login?next=${encodeURIComponent(redirectTo)}`)
    }

    redirect(`/${locale}/login`)
}

export async function loginWithGoogle(locale: string = 'es', redirectTo?: string | null) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3004'

    const callbackUrl = new URL(`${origin}/${locale}/auth/callback`);
    if (redirectTo) {
        callbackUrl.searchParams.set('next', redirectTo);
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: callbackUrl.toString(),
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    })

    if (error) {
        console.error('Error signing in with Google:', error)
        return { error: error.message }
    }

    if (data.url) {
        redirect(data.url)
    }
}
