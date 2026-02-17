
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const { pathname, searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    // Extract locale - typically the first segment after /
    const locale = pathname.split('/')[1] || 'es'

    if (code) {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Redirect to the specified next URL with locale
            const redirectUrl = next.startsWith('/') ? `${origin}/${locale}${next}` : `${origin}/${locale}/${next}`
            return NextResponse.redirect(redirectUrl)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/${locale}/login?error=auth-code-error`)
}
