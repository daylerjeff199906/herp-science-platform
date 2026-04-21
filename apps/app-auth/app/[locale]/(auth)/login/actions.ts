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

const isDev = process.env.NODE_ENV === 'development';

/**
 * Normaliza URLs de producción a local durante el desarrollo.
 */
function normalizeUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (!isDev) return url;

    // Mapeo de dominios de producción a puertos locales
    const domainMapping: Record<string, string> = {
        'auth.iiap.gob.pe': 'localhost:3003',
        'intranet.iiap.gob.pe': 'localhost:3004',
        'vertebrados.iiap.gob.pe': 'localhost:3005',
        'fonoteca.iiap.gob.pe': 'localhost:3006',
        'panel.iiap.gob.pe': 'localhost:3007',
        'noticias.iiap.gob.pe': 'localhost:3000',
    };

    try {
        const u = new URL(url);
        const host = u.host;

        if (domainMapping[host]) {
            u.host = domainMapping[host];
            u.protocol = 'http:';
            return u.toString();
        }
    } catch (e) {
        // Ignorar si no es una URL absoluta válida
    }
    return url;
}

function resolveRedirect(path: string | null | undefined, fallback: string, locale: string): string {
    if (!path) return fallback
    // Si es una URL absoluta, la normalizamos (útil en desarrollo para redirigir a puertos locales)
    if (path.startsWith('http')) return normalizeUrl(path)
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

        // Consultar módulos/roles asignados en la base de datos
        const modules = await getUserModules(supabase, data.user.id);

        let targetUrl = `/${locale}/launcher`;

        if (modules.length === 0) {
            // Redirección por defecto si no hay módulos
            targetUrl = isDev ? 'http://localhost:3004' : 'https://intranet.iiap.gob.pe/';
        } else if (modules.length === 1) {
            // Si solo tiene uno, vamos directo usando las nuevas columnas url_local/url_prod y path
            const mod = modules[0]
            const baseUrl = isDev ? (mod.url_local || mod.url_prod) : mod.url_prod
            const modulePath = mod.path || '/'
            
            // Si la URL base ya es absoluta, la usamos construyendo con el path
            if (baseUrl && baseUrl.startsWith('http')) {
                const url = new URL(baseUrl)
                url.pathname = modulePath.startsWith('/') ? modulePath : `/${modulePath}`
                targetUrl = url.toString()
            } else {
                targetUrl = modulePath
            }
        }

        // Priorizar el parámetro de redirección (p. ej. si vino de una app específica)
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
