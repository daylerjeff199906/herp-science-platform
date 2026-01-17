import { fetchClient } from './fetch-client'
import { ApiError } from './api-errors'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text()
    let errorDetails: unknown
    try {
      errorDetails = JSON.parse(errorText)
    } catch {
      errorDetails = errorText
    }
    throw new ApiError(
      `Request failed with status ${response.status}`,
      response.status,
      errorDetails
    )
  }

  if (response.status === 204) return {} as T

  const text = await response.text()
  try {
    return text ? JSON.parse(text) : ({} as T)
  } catch {
    return {} as T
  }
}

export async function get<T>(
  path: string,
  headers: Record<string, string> = {}
): Promise<T> {
  const response = await fetchClient(path, { method: 'GET', headers })
  return handleResponse<T>(response)
}

export async function post<T>(
  path: string,
  body: unknown,
  isFormData = false,
  headers: Record<string, string> = {}
): Promise<T> {
  const response = await fetchClient(path, {
    method: 'POST',
    body: isFormData ? (body as FormData) : JSON.stringify(body),
    headers,
  })
  return handleResponse<T>(response)
}

export async function put<T>(
  path: string,
  body: unknown,
  isFormData = false,
  headers: Record<string, string> = {}
): Promise<T> {
  const response = await fetchClient(path, {
    method: 'PUT',
    body: isFormData ? (body as FormData) : JSON.stringify(body),
    headers,
  })
  return handleResponse<T>(response)
}

export async function patch<T>(
  path: string,
  body: unknown,
  isFormData = false,
  headers: Record<string, string> = {}
): Promise<T> {
  const response = await fetchClient(path, {
    method: 'PATCH',
    body: isFormData ? (body as FormData) : JSON.stringify(body),
    headers,
  })
  return handleResponse<T>(response)
}

export async function del<T>(
  path: string,
  headers: Record<string, string> = {}
): Promise<T> {
  const response = await fetchClient(path, { method: 'DELETE', headers })
  return handleResponse<T>(response)
}

export const fetchMethods = {
  get,
  post,
  put,
  patch,
  del,
  delete: del,
}

export const httpClient = fetchMethods
