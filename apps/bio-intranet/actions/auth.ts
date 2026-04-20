'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { cookies, headers } from 'next/headers'

export async function signout(redirectTo?: string, locale: string = 'es') {
    const cookieStore = await cookies()
    const headerList = await headers()
    const host = headerList.get('host') || ''
    const supabase = createClient(cookieStore, host)
    
    await supabase.auth.signOut()

    const isDev = host.includes('localhost') || host.includes('127.0.0.1')
    const loginUrl = isDev ? 'http://localhost:3003/login' : 'https://auth.iiap.gob.pe/'

    revalidatePath('/', 'layout')

    redirect(loginUrl)
}
