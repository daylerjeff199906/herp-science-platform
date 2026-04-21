import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { cookies, headers } from 'next/headers'

export default async function LoginPage(props: { params: Promise<{ locale: string }>; searchParams: Promise<{ redirect?: string; next?: string }> }) {
    const { locale } = await props.params;
    const { redirect: redirectTo, next } = await props.searchParams;
    const finalRedirectParam = redirectTo || next;

    const cookieStore = await cookies()
    const headerList = await headers()
    const host = headerList.get('host') || ''
    const supabase = createClient(cookieStore, host)
    const isDev = host.includes('localhost') || host.includes('127.0.0.1')

    // Consultar configuración de módulos para redirección dinámica
    const [{ data: moduleData }, { data: authModule }] = await Promise.all([
        supabase.from('modules').select('url_prod, url_local, path').eq('code', 'intranet').maybeSingle(),
        supabase.from('modules').select('url_prod, url_local').eq('code', 'auth').maybeSingle()
    ])

    // Determinar la URL base según el entorno
    const baseUrl = isDev
        ? (moduleData?.url_local || 'http://localhost:3004')
        : (moduleData?.url_prod || 'https://explora.iiap.gob.pe')

    const authBaseUrl = isDev
        ? (authModule?.url_local || 'http://localhost:3003')
        : (authModule?.url_prod || 'https://auth.iiap.gob.pe')

    const modulePath = moduleData?.path || '/dashboard'

    // Construir la URL de retorno
    const finalRedirect = finalRedirectParam || `${baseUrl}/${locale}${modulePath.startsWith('/') ? modulePath : '/' + modulePath}`;
    const loginUrl = `${authBaseUrl}/${locale}/login?redirect=${encodeURIComponent(finalRedirect)}`;

    redirect(loginUrl);

    return null;
}
