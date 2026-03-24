import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const host = request.headers.get('host') || '';
    const isProd = host.includes('iiap.gob.pe');

    // Usamos el cliente de bio-intranet para validar la sesión de Auth.
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_BIO_INTRANET_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_BIO_INTRANET_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) => {
                        const cookieOptions = { ...options };
                        if (isProd) {
                            cookieOptions.domain = '.iiap.gob.pe';
                        }
                        supabaseResponse.cookies.set(name, value, cookieOptions);
                    })
                },
            },
            cookieOptions: isProd ? { domain: '.iiap.gob.pe' } : undefined,
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protegemos todas las rutas excepto /login, /signup, etc.
    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/auth')
    ) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}

// Rutas a las que se aplica el middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
