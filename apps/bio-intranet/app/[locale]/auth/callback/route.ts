
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const { pathname, searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    let next = searchParams.get('next') ?? '/dashboard'
    if (next === '/') next = '/dashboard'

    // Extract locale - typically the first segment after /
    const locale = pathname.split('/')[1] || 'es'

    if (code) {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.user) {
            // Check if onboarding is completed
            const { data: profile } = await supabase
                .from('profiles')
                .select('onboarding_completed')
                .eq('id', data.user.id)
                .maybeSingle()

            // If profile doesn't exist yet (trigger might be slow) or onboarding not completed
            // we redirect to onboarding. 
            // Note: If profile is null, it means the trigger hasn't run or failed, 
            // but for a new user we definitely want them to go to onboarding.
            if (!profile || !profile.onboarding_completed) {
                return NextResponse.redirect(`${origin}/${locale}/onboarding`)
            }

            // Redirect to the specified next URL with locale
            const redirectUrl = next.startsWith('/') ? `${origin}/${locale}${next}` : `${origin}/${locale}/${next}`
            return NextResponse.redirect(redirectUrl)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/${locale}/login?error=auth-code-error`)
}
