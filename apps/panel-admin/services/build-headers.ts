'use server'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { ICredentials } from '@/types'

export async function buildHeaders(): Promise<Record<string, string>> {
    const cookie = (await cookies()).get(`${process.env.APP_NAME}_session`)?.value
    const session = await decrypt(cookie)
    const userData: ICredentials =
        (await session?.data) as unknown as ICredentials
    const token = userData?.token

    const headers: Record<string, string> = {}

    if (token) headers['Authorization'] = `Bearer ${token}`
    headers['Content-Type'] = 'application/json' // <-- Añade esta línea

    return headers
}