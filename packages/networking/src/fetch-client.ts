
import { ApiClientConfig, FetchOptions } from './types'

export function createFetchClient(config: ApiClientConfig) {
    return async function fetchClient(path: string, options: FetchOptions = {}) {
        const headers: Record<string, string> = { ...config.headers }

        // Resolve absolute URL
        const url = path.startsWith('http') ? path : `${config.baseUrl}${path}`

        // Inject Authorization header if getToken is provided
        if (config.getToken) {
            const token = await config.getToken()
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }
        }

        const newOptions = {
            ...options,
            headers: { ...headers, ...(options.headers || {}) },
        }

        // Ensure Content-Type is set to application/json if not present and body is a string (or not FormData)
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

        return fetch(url, newOptions as RequestInit)
    }
}
