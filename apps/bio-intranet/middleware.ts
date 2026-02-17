import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export default async function middleware(request: NextRequest) {
  const handleI18n = createMiddleware({
    locales: ['en', 'es'],
    defaultLocale: 'es',
    localePrefix: 'always',
  })

  const response = handleI18n(request)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Determine locale from path
  const localeMatch = pathname.match(/^\/(en|es)/)
  const locale = localeMatch ? localeMatch[1] : 'es'

  // Paths that do not require authentication
  const publicPathRegex =
    /^\/(en|es)?\/?(login|signup|auth|forgot-password|reset-password|icon\.png|.*\.svg).*$/

  // Auth pages (login, signup, etc)
  const authPathRegex =
    /^\/(en|es)?\/?(login|signup|forgot-password|reset-password).*$/

  // Onboarding path
  const onboardingPathRegex = /^\/(en|es)?\/?onboarding.*$/

  // If user is NOT logged in
  if (!user) {
    // Allow access to public paths and home
    if (
      pathname.match(publicPathRegex) ||
      pathname === '/' ||
      pathname.match(/^\/(en|es)$/)
    ) {
      return response
    }
    // Redirect to login for all other routes
    const loginUrl = new URL(`/${locale}/login`, request.url)
    return NextResponse.redirect(loginUrl)
  }

  // User IS logged in

  // Check if user has completed onboarding
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single()

  const hasCompletedOnboarding = profile?.onboarding_completed === true

  // If trying to access auth pages (login, signup, etc) while logged in
  if (pathname.match(authPathRegex)) {
    // Redirect to dashboard or onboarding based on completion status
    const redirectPath = hasCompletedOnboarding ? 'dashboard' : 'onboarding'
    const redirectUrl = new URL(`/${locale}/${redirectPath}`, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user hasn't completed onboarding and is NOT on onboarding page
  if (!hasCompletedOnboarding && !pathname.match(onboardingPathRegex)) {
    const onboardingUrl = new URL(`/${locale}/onboarding`, request.url)
    return NextResponse.redirect(onboardingUrl)
  }

  // If user HAS completed onboarding and tries to access onboarding page
  if (hasCompletedOnboarding && pathname.match(onboardingPathRegex)) {
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next|api|_vercel|.*\\..*).*)'],
}
