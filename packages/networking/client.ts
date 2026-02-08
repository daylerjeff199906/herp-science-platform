const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error(
    'FATAL: La variable de entorno NEXT_PUBLIC_API_URL no está definida.'
  )
}

interface RequestOptions extends RequestInit {
  params?: Record<string, any>
}

const request = async <T>(endpoint: string, options: RequestOptions = {}): Promise<{ data: T }> => {
  const { params, ...fetchOptions } = options
  let url = `${API_URL}${endpoint}`

  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  })

  if (!response.ok) {
    if (response.status !== 403) {
      try {
        const errorData = await response.json().catch(() => null)
        console.error('API Error:', errorData || response.statusText)
      } catch (e) {
        console.error('API Error:', response.statusText)
      }
    }
    // Return null data instead of throwing to prevent app crash
    return { data: null as unknown as T }
  }

  try {
    const data = await response.json()
    return { data }
  } catch (error) {
    console.error('API Error (Parse):', error)
    return { data: null as unknown as T }
  }
}

export const apiClient = {
  get: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, body: any, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(url: string, body: any, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'DELETE' }),
}
