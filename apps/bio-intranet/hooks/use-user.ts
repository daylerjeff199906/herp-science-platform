'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export interface UserData {
  id: string
  name: string
  email: string
  avatar: string | null
}

export function useUser() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      const supabase = createClient()

      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error || !user) {
          setUser(null)
          setIsLoading(false)
          return
        }

        // Obtener el perfil del usuario
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.id)
          .maybeSingle()

        const firstName =
          profile?.first_name || user.user_metadata?.first_name || ''
        const lastName =
          profile?.last_name || user.user_metadata?.last_name || ''

        setUser({
          id: user.id,
          name:
            `${firstName} ${lastName}`.trim() ||
            user.email?.split('@')[0] ||
            'Usuario',
          email: user.email || '',
          avatar: profile?.avatar_url || user.user_metadata?.avatar_url || null,
        })
      } catch (error) {
        console.error('Error fetching user:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()
  }, [])

  return { user, isLoading }
}
