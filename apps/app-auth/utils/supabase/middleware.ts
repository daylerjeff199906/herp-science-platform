import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const host = request.headers.get('host') || '';
    const isProd = host.includes('iiap.gob.pe');

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

    const pathname = request.nextUrl.pathname;
    const isAuthPage = pathname.includes('/login') || 
                       pathname.includes('/auth') || 
                       pathname.includes('/signup') || 
                       pathname.includes('/forgot-password') || 
                       pathname.includes('/reset-password');

    if (!user && !isAuthPage && pathname !== '/') {
        const url = request.nextUrl.clone()
        url.pathname = '/es/login' // Fallback to Spanish login
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
