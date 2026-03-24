'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import { createBioIntranetServer } from '@/utils/supabase/bio-intranet/server'

type LoginResponse = {
    error?: string
    redirectUrl?: string
}

function resolveRedirect(path: string | null | undefined, fallback: string): string {
    if (!path) return fallback
    if (path.startsWith('http')) return path
    return path
}

export async function login(formData: FormData, redirectTo?: string | null): Promise<LoginResponse> {
    const cookieStore = await cookies()
    const headerList = await headers()
    const host = headerList.get('host') || ''

    const supabase = await createBioIntranetServer(cookieStore, host)

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Por favor complete todos los campos.' }
    }

    const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    if (data.user) {
        // 1. Fetch profile to get profile.id
        const { data: profile } = await supabase
            .from('profiles')
            .select('id, auth_id')
            .eq('auth_id', data.user.id)
            .single()

        if (!profile) {
            console.error('No se encontró perfil para el usuario:', data.user.id)
            return { error: 'No se encontró estructura de perfil para este usuario.' }
        }

        // 2. Fetch roles with join
        const { data: userRolesData, error: rolesError } = await supabase
            .from('user_roles')
            .select(`role_id, roles(name)`)
            .eq('profile_id', profile.id)

        if (rolesError) {
            console.error('Error fetching user roles:', rolesError)
        }
        const roles: string[] = userRolesData?.map((ur: any) => ur.roles?.name) || []
        const roleIds: string[] = userRolesData?.map((ur: any) => ur.role_id) || []

        // Check if user is explicit Admin, which might grant super access
        if (roles.includes('admin')) {
            revalidatePath('/', 'layout')
            return { redirectUrl: resolveRedirect(redirectTo, '/dashboard') }
        }

        // 3. Fetch permissions for those roles
        if (roleIds.length > 0) {
            const { data: rolePermissionsData, error: permissionsError } = await supabase
                .from('role_permissions')
                .select(`permission_id, permissions(module_name)`)
                .in('role_id', roleIds)
            console.log(rolePermissionsData)

            if (permissionsError) {
                console.error('Error fetching role permissions:', permissionsError)
            }

            // Verify access to the "fonoteca" module
            const hasFonotecaPermission = rolePermissionsData?.some((rp: any) => {
                const moduleName = rp.permissions?.module_name?.toLowerCase()
                return moduleName === 'fonoteca'
            })

            if (hasFonotecaPermission) {
                revalidatePath('/', 'layout')
                return { redirectUrl: resolveRedirect(redirectTo, '/dashboard') }
            }
        }

        // No permissions
        console.warn(`Usuario ${data.user.email} intentó acceder sin permisos a fonoteca`)
        await supabase.auth.signOut() // Sign out to prevent orphaned session without authorization
        return { error: 'No tienes permisos para acceder al módulo de Fonoteca.' }
    }

    revalidatePath('/', 'layout')
    return { redirectUrl: resolveRedirect(redirectTo, '/dashboard') }
}

export async function signout() {
    const cookieStore = await cookies()
    const headerList = await headers()
    const host = headerList.get('host') || ''
    const supabase = await createBioIntranetServer(cookieStore, host)

    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function loginWithGoogle(redirectTo?: string | null) {
    const cookieStore = await cookies()
    const headerList = await headers()
    const host = headerList.get('host') || ''
    const supabase = await createBioIntranetServer(cookieStore, host)

    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005'

    const callbackUrl = new URL(`${origin}/auth/callback`);
    if (redirectTo) {
        callbackUrl.searchParams.set('next', redirectTo);
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: callbackUrl.toString(),
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    })

    if (error) {
        console.error('Error signing in with Google:', error)
        return { error: error.message }
    }

    if (data.url) {
        redirect(data.url)
    }
}
