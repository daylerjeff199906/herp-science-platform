import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
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
          const host = request.headers.get('host') || ''
          const isProd = host.includes('iiap.gob.pe')

          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions = { ...options }
            if (isProd) {
              cookieOptions.domain = '.iiap.gob.pe'
            }
            response.cookies.set(name, value, cookieOptions)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Determine locale from path or redirect to default if missing
  const localeMatch = pathname.match(/^\/(en|es)(\/|$)/)
  
  // Public files and internal next paths should not be redirected
  const isInternal = pathname.startsWith('/_next') || 
                     pathname.startsWith('/api') || 
                     pathname.includes('.')
  
  if (!localeMatch && !isInternal) {
    return NextResponse.redirect(new URL(`/es${pathname}${request.nextUrl.search}`, request.url))
  }

  const locale = localeMatch ? localeMatch[1] : 'es'

  // Paths that do not require authentication
  const publicPathRegex =
    /^\/(en|es)?\/?(login|signup|auth|forgot-password|reset-password|icon\.png|.*\.svg).*$/

  // Auth pages (login, signup, etc)
  const authPathRegex =
    /^\/(en|es)?\/?(login|signup|forgot-password|reset-password).*$/

  // Onboarding path
  const onboardingPathRegex = /^\/(en|es)?\/?onboarding.*$/

  const host = request.headers.get('host') || ''
  const isDev = host.includes('localhost') || host.includes('127.0.0.1')
  const authUrl = isDev ? 'http://localhost:3003' : 'https://auth.iiap.gob.pe'
  const loginUrl = `${authUrl}/login`

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
    // Redirect to EXTERNAL login
    return NextResponse.redirect(new URL(loginUrl))
  }

  // User IS logged in
  // Any authenticated user can enter bio-intranet. 
  // We'll further check if they need onboarding or can go to dashboard.
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, onboarding_completed')
    .eq('auth_id', user.id)
    .single()

  const hasCompletedOnboarding = profile?.onboarding_completed === true


  const rootPathRegex = /^\/(en|es)?\/?$/
  const isInRoot = pathname === '/' || pathname.match(rootPathRegex)

  // If trying to access auth pages or root while logged in as Cliente
  if (pathname.match(authPathRegex) || isInRoot) {
    // Honor ?next= param if present, otherwise go to dashboard/onboarding
    const nextParam = request.nextUrl.searchParams.get('next')
    if (nextParam) {
      let targetPath = nextParam
      if (!nextParam.startsWith('http') && !nextParam.startsWith('https')) {
        let cleanPath = nextParam
        if (!cleanPath.startsWith('/')) {
          cleanPath = `/${cleanPath}`
        }
        const hasLocale = cleanPath.match(/^\/(en|es)($|\/)/)
        if (!hasLocale) {
          targetPath = `/${locale}${cleanPath}`
        } else {
          targetPath = cleanPath
        }
      }
      const nextUrl = new URL(targetPath, request.url)
      return NextResponse.redirect(nextUrl)
    }
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

  // Forward the current path as headers so Server Components can read it
  response.headers.set('x-pathname', pathname)
  response.headers.set('x-search', request.nextUrl.search)

  return response
}

export default proxy

export const config = {
  matcher: ['/((?!_next|api|_vercel|.*\\..*).*)'],
}
