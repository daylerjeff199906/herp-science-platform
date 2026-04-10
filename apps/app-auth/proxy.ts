import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/utils/supabase/middleware';
import { type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
    locales: ['en', 'es'],
    defaultLocale: 'es',
    localePrefix: 'as-needed'
});

export async function proxy(request: NextRequest) {
    // 1. Run supabase middleware for session handling and route protection
    const supabaseResponse = await updateSession(request);

    // If updateSession returned a redirect (e.g., to /login), return it immediately
    if (supabaseResponse.headers.get('location')) {
        return supabaseResponse;
    }

    // 2. Run next-intl middleware for locale handling
    // We pass the potentially modified response/headers
    return intlMiddleware(request);
}

export const config = {
    // Matcher including localized routes and root
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
