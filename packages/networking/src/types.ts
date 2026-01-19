
export interface FetchOptions extends RequestInit {
    headers?: Record<string, string>
}

export interface ApiClientConfig {
    baseUrl: string
    getToken?: () => Promise<string | undefined | null>
    headers?: Record<string, string>
}
