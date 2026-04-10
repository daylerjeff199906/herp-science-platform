import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/utils/supabase/middleware';
import { type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
    locales: ['en', 'es'],
    defaultLocale: 'es'
});

export async function proxy(request: NextRequest) {
    // 1. Run next-intl middleware for locale handling
    const response = await intlMiddleware(request);

    // 2. Run supabase middleware for session handling
    // We pass the response from intlMiddleware so both can modify headers/cookies
    return await updateSession(request);
}

export const config = {
    // Matcher including localized routes
    matcher: ['/', '/(de|en|es|pt)/:path*', '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
