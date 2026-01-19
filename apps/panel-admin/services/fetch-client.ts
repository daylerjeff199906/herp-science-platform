'use server'
import { ENV } from '@/services/env'
import { getSession } from '@/lib/session'

export async function fetchClient(path: string, options: RequestInit) {
  const headers: Record<string, string> = {}

  // Resolve absolute URL
  const url = path.startsWith('http') ? path : `${ENV.API_BASE_URL}${path}`

  // Auto-inject Authorization header if session exists (Server-side)
  // Logic adapted to support both client/server if needed, but primarily server-side via cookies
  const session = await getSession()
  if (session?.data?.token) {
    headers['Authorization'] = `Bearer ${session.data.token}`
  }

  const newOptions = {
    ...options,
    headers: { ...headers, ...(options?.headers || {}) },
  }

  // Ensure Content-Type is set to application/json if not present and body is a string
  const headersObj = newOptions.headers as Record<string, string>
  const isFormData = newOptions.body instanceof FormData

  if (
    !isFormData &&
    typeof newOptions.body === 'string' &&
    !headersObj['Content-Type'] &&
    !headersObj['content-type']
  ) {
    headersObj['Content-Type'] = 'application/json'
  }
  return fetch(url, newOptions)
}
