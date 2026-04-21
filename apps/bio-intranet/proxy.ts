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

  // Paths that MUST be protected
  const protectedPathRegex = /^\/(en|es)?\/?(dashboard|onboarding).*$/

  // Auth pages (login, signup, etc)
  const authPathRegex = /^\/(en|es)?\/?(login|signup|forgot-password|reset-password).*$/

  // Onboarding path
  const onboardingPathRegex = /^\/(en|es)?\/?onboarding.*$/

  const host = request.headers.get('host') || ''
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
  // Construir la URL de retorno respetando el locale
  const fullRedirectUrl = `${baseUrl}/${locale}${modulePath.startsWith('/') ? modulePath : '/' + modulePath}`
  const loginUrl = `${authBaseUrl}/${locale}/login?redirect=${encodeURIComponent(fullRedirectUrl)}`

  // 1. IF NOT LOGGED IN
  if (!user) {
    // If trying to access a protected path, redirect to login
    if (pathname.match(protectedPathRegex)) {
      return NextResponse.redirect(new URL(loginUrl))
    }
    // Otherwise allow access (Public Landing, Facilities, etc)
    return response
  }

  // 2. IF LOGGED IN
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, onboarding_completed')
    .eq('auth_id', user.id)
    .single()

  const hasCompletedOnboarding = profile?.onboarding_completed === true

  // If user is on an auth page, send them to their appropriate start page
  if (pathname.match(authPathRegex)) {
    const redirectPath = hasCompletedOnboarding ? 'dashboard' : 'onboarding'
    return NextResponse.redirect(new URL(`/${locale}/${redirectPath}`, request.url))
  }

  // If user hasn't completed onboarding and is trying to access dashboard
  if (!hasCompletedOnboarding && pathname.includes('/dashboard')) {
    return NextResponse.redirect(new URL(`/${locale}/onboarding`, request.url))
  }

  // If user HAS completed onboarding and tries to access onboarding page
  if (hasCompletedOnboarding && pathname.match(onboardingPathRegex)) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
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
