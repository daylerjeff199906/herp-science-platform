'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createBioIntranetServer } from '@/utils/supabase/bio-intranet/server'

export async function signout() {
    const cookieStore = await cookies()
    const headerList = await headers()
    const host = headerList.get('host') || ''
    const supabase = await createBioIntranetServer(cookieStore, host)

    await supabase.auth.signOut()

    const isDev = host.includes('localhost') || host.includes('127.0.0.1')
    const loginUrl = isDev ? 'http://localhost:3003/login' : 'https://auth.iiap.gob.pe/'

    revalidatePath('/', 'layout')
    redirect(loginUrl)
}
