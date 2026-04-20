import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_BIO_INTRANET_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_BIO_INTRANET_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    const host = request.headers.get('host') || ''
                    const isProd = host.includes('iiap.gob.pe')
                    
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
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

    const { data: { user } } = await supabase.auth.getUser()

    const isDev = request.nextUrl.hostname === 'localhost' || request.nextUrl.hostname === '127.0.0.1'
    const loginUrl = isDev ? 'http://localhost:3003/login' : 'https://auth.iiap.gob.pe/'

    // If not logged in and not on public paths
    if (!user && !request.nextUrl.pathname.startsWith('/auth')) {
        return NextResponse.redirect(loginUrl)
    }

    if (user) {
        // Optionale: Permiso check here if we want early exit
        // But for modules, it's better to do it in layout to show a nice "Acceso denegado"
    }

    return response
}

export default proxy

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
