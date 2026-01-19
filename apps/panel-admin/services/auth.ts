/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { redirect } from 'next/navigation'

import { createSession, deleteSession } from '@/lib/session'
import { IAuth, ICredentials, IResposeLogin } from '@/types'
import { fetchMethods } from '@/lib/api'
import { urlBase } from './config'

export const fetchAuthLogin = async (data: IAuth): Promise<IResposeLogin> => {
  const path = urlBase.login

  try {
    // ApiClient post returns Promise<T> (the data itself), or throws ApiError
    const responseData = await fetchMethods.post<ICredentials>(path, data)

    await createSession(responseData)
    return {
      status: 200,
      data: responseData,
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'ApiError') {
      const apiError = error as unknown as { status: number; details?: any }
      const status = apiError.status || 400
      // Extract error message safely
      const details = apiError.details as
        | { message?: string }
        | string
        | undefined
      const message =
        typeof details === 'object' && details?.message
          ? details.message
          : typeof details === 'string'
            ? details
            : 'Error en el inicio de sesión'

      return {
        status,
        errors: [message],
      }
    }

    console.error('Error al realizar la petición:', error)
    return {
      status: 500,
      errors: ['Error al conectar con el servidor.'],
    }
  }
}

export const logout = async () => {
  await deleteSession()
  redirect('/login')
}
