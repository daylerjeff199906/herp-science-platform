'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { cookies, headers } from 'next/headers'
import { getUserModules } from '@/utils/supabase/queries'

type LoginResponse = {
    error?: string
    redirectUrl?: string
}

function resolveRedirect(path: string | null | undefined, fallback: string, locale: string): string {
    if (!path) return fallback
    if (path.startsWith('http')) return path
    const knownLocales = ['es', 'en', 'pt']
    const segments = path.split('/').filter(Boolean)
    const firstSegment = segments[0] ?? ''
    if (knownLocales.includes(firstSegment)) return path
    return `/${locale}${path.startsWith('/') ? path : '/' + path}`
}

export async function login(formData: FormData, locale: string = 'es', redirectTo?: string | null): Promise<LoginResponse> {
    const cookieStore = await cookies()
    const headerList = await headers()
    const host = headerList.get('host') || ''
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
        revalidatePath('/', 'layout')

        // Check for modules assignment
        const modules = await getUserModules(supabase, data.user.id);

        let targetUrl = `/${locale}/launcher`;

        if (modules.length === 0) {
            // Default redirection to Intranet dashboard if no modules are assigned
            targetUrl = process.env.NODE_ENV === 'development'
                ? `http://localhost:3004/${locale}/dashboard`
                : `https://intranet.iiap.gob.pe/${locale}/dashboard`;
        }

        const finalRedirect = resolveRedirect(redirectTo, targetUrl, locale)
        return { redirectUrl: finalRedirect }
    }

    return { error: 'Unknown error' }
}

export async function loginWithGoogle(locale: string = 'es', redirectTo?: string | null) {
    const cookieStore = await cookies()
    const headerList = await headers()
    const host = headerList.get('host') || ''
    const supabase = createClient(cookieStore, host)

    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005'

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

export async function resetPassword(formData: FormData, locale: string = 'es') {
    const cookieStore = await cookies()
    const headerList = await headers()
    const host = headerList.get('host') || ''
    const supabase = createClient(cookieStore, host)

    const email = formData.get('email') as string
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005'

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/${locale}/reset-password`,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}
