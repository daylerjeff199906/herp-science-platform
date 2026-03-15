'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { cookies, headers } from 'next/headers'

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
    const headerList = await headers()
    const host = headerList.get('host') || ''
    const isProd = host.includes('iiap.gob.pe')
    const platformUrl = isProd ? 'https://auth.iiap.gob.pe' : 'http://localhost:3004'

    const supabase = createClient(cookieStore, host)

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    if (data.user) {
        // Consultar el perfil para obtener el profile.id usando el auth_id
        const { data: profile } = await supabase
            .from('profiles')
            .select('id, onboarding_completed')
            .eq('auth_id', data.user.id)
            .single()

        if (!profile) {
            console.error('No profile found for user:', data.user.id)
        }

        // Si existe check de onboarding, lo conservamos
        if (profile && !profile.onboarding_completed) {
            revalidatePath('/', 'layout')
            return { redirectUrl: `/${locale}/onboarding` }
        }

        // Consultar los roles del usuario asignados en user_roles usando el ID del perfil
        const { data: userRolesData, error: rolesError } = await supabase
            .from('user_roles')
            .select(`*, roles(*)`)
            .eq('profile_id', profile?.id || '')

        if (rolesError) {
            console.error('Error fetching user roles:', rolesError)
        }
        
        const roles: string[] = userRolesData?.map((ur: any) => ur.roles?.name).filter(Boolean) || []

        // Mapa de roles internos de la aplicación y sus redirecciones
        const roleRedirects: Record<string, string> = {
            'admin': `/${locale}/admin`,
            'reviewer': `/${locale}/reviewer`,
        }

        // 1. Buscamos si el usuario tiene algún rol mapeado a la app interna
        for (const role of roles) {
            if (roleRedirects[role]) {
                revalidatePath('/', 'layout')
                return { redirectUrl: roleRedirects[role] }
            }
        }

        // 2. Si tiene 'client', 'user', o no tiene roles, lo mandamos hacia la otra plataforma
        if (roles.includes('client') || roles.includes('user') || roles.length === 0) {
            const nextParam = redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ''
            const redirectUrl = `${platformUrl}/${locale}/dashboard${nextParam}`

            revalidatePath('/', 'layout')
            return { redirectUrl }
        }

        // Fallback genérico para cualquier otro escenario
        revalidatePath('/', 'layout')
        return { redirectUrl: `/${locale}/admin` }
    }

    revalidatePath('/', 'layout')
    return { redirectUrl: `/${locale}/admin` }
}

export async function signup(formData: FormData) {
    const cookieStore = await cookies()
    const headerList = await headers()
    const host = headerList.get('host') || ''
    const supabase = createClient(cookieStore, host)

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
    const headerList = await headers()
    const host = headerList.get('host') || ''
    const supabase = createClient(cookieStore, host)
    
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')

    if (redirectTo) {
        redirect(`/${locale}/login?next=${encodeURIComponent(redirectTo)}`)
    }

    redirect(`/${locale}/login`)
}

export async function loginWithGoogle(locale: string = 'es', redirectTo?: string | null) {
    const cookieStore = await cookies()
    const headerList = await headers()
    const host = headerList.get('host') || ''
    const supabase = createClient(cookieStore, host)

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
