import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const { pathname, searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    let next = searchParams.get('redirect') || searchParams.get('next') || '/launcher'
    if (next === '/') next = '/launcher'

    const locale = pathname.split('/')[1] || 'es'

    if (code) {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)
        await supabase.auth.exchangeCodeForSession(code)

        // Redirección simple al dashboard o al parámetro 'next'
        let redirectUrl;
        if (next.startsWith('http')) {
            redirectUrl = next;
        } else if (next.startsWith(`/${locale}/`) || next === `/${locale}`) {
            redirectUrl = `${origin}${next}`;
        } else {
            redirectUrl = next.startsWith('/') ? `${origin}/${locale}${next}` : `${origin}/${locale}/${next}`;
        }
        return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.redirect(`${origin}/${locale}/login?error=auth-code-error`)
}
