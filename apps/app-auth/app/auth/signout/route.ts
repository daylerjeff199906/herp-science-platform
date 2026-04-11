import { createClient } from '@/utils/supabase/server'
import { cookies, headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const cookieStore = await cookies()
    const headerList = await headers()
    const host = headerList.get('host') || ''
    const supabase = createClient(cookieStore, host)

    // Check if we have a user session before attempting to sign out
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        await supabase.auth.signOut()
    }

    const { origin } = new URL(request.url)
    return NextResponse.redirect(`${origin}/es/login`, {
        status: 302,
    })
}
