import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export default async function middleware(request: NextRequest) {
    const handleI18n = createMiddleware({
        locales: ['en', 'es'],
        defaultLocale: 'es',
        localePrefix: 'always'
    });

    const response = handleI18n(request);

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value);
                    });
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Paths that do not require authentication
    // Note: We check for localized paths too (e.g. /es/login)
    const publicPathRegex = /^\/(en|es)?\/?(login|signup|auth|forgot-password|reset-password|icon\.png|.*\.svg).*$/;

    if (!user && !pathname.match(publicPathRegex) && pathname !== '/' && !pathname.match(/^\/(en|es)$/)) {
        // Determine locale to redirect to
        const localeMatch = pathname.match(/^\/(en|es)/);
        const locale = localeMatch ? localeMatch[1] : 'es'; // Default to 'es'

        const loginUrl = new URL(`/${locale}/login`, request.url);
        return NextResponse.redirect(loginUrl);
    }

    return response;
}

export const config = {
    matcher: ['/((?!_next|api|_vercel|.*\\..*).*)']
};
