
import { ApiError } from './error'
import { createFetchClient } from './fetch-client'
import { ApiClientConfig } from './types'

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

export class ApiClient {
    private fetchClient: ReturnType<typeof createFetchClient>

    constructor(config: ApiClientConfig) {
        this.fetchClient = createFetchClient(config)
    }

    async get<T>(path: string, headers: Record<string, string> = {}): Promise<T> {
        const response = await this.fetchClient(path, { method: 'GET', headers })
        return handleResponse<T>(response)
    }

    async post<T>(
        path: string,
        body: unknown,
        isFormData = false,
        headers: Record<string, string> = {}
    ): Promise<T> {
        const response = await this.fetchClient(path, {
            method: 'POST',
            body: isFormData ? (body as FormData) : JSON.stringify(body),
            headers,
        })
        return handleResponse<T>(response)
    }

    async put<T>(
        path: string,
        body: unknown,
        isFormData = false,
        headers: Record<string, string> = {}
    ): Promise<T> {
        const response = await this.fetchClient(path, {
            method: 'PUT',
            body: isFormData ? (body as FormData) : JSON.stringify(body),
            headers,
        })
        return handleResponse<T>(response)
    }

    async patch<T>(
        path: string,
        body: unknown,
        isFormData = false,
        headers: Record<string, string> = {}
    ): Promise<T> {
        const response = await this.fetchClient(path, {
            method: 'PATCH',
            body: isFormData ? (body as FormData) : JSON.stringify(body),
            headers,
        })
        return handleResponse<T>(response)
    }

    async del<T>(
        path: string,
        headers: Record<string, string> = {}
    ): Promise<T> {
        const response = await this.fetchClient(path, { method: 'DELETE', headers })
        return handleResponse<T>(response)
    }
}
