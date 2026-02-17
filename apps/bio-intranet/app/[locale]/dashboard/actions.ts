'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export interface UserData {
  id: string
  name: string
  email: string
  avatar: string | null
  firstName: string | null
  lastName: string | null
}

export async function getCurrentUser(): Promise<UserData | null> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      console.log('No authenticated user found')
      return null
    }

    // Intentar obtener el perfil del usuario, pero no fallar si no existe
    let profile = null
    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .maybeSingle() // Usar maybeSingle en lugar de single para no fallar si no existe

      if (profileError) {
        console.log(
          'Profile fetch warning (non-critical):',
          profileError.message
        )
      } else {
        profile = data
      }
    } catch (profileFetchError) {
      console.log('Profile fetch error (non-critical):', profileFetchError)
    }

    const firstName =
      profile?.first_name || user.user_metadata?.first_name || ''
    const lastName = profile?.last_name || user.user_metadata?.last_name || ''

    // Si no hay nombre, usar el email o "Usuario"
    const displayName =
      `${firstName} ${lastName}`.trim() ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'Usuario'

    return {
      id: user.id,
      name: displayName,
      email: user.email || '',
      avatar: profile?.avatar_url || user.user_metadata?.avatar_url || null,
      firstName,
      lastName,
    }
  } catch (error) {
    console.error('Critical error getting current user:', error)
    return null
  }
}
