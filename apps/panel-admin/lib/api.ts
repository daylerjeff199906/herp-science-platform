
import { ApiClient } from '@repo/networking'
import { getSession } from './session'

const API_Base_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export const apiClient = new ApiClient({
    baseUrl: API_Base_URL,
    getToken: async () => {
        const session = await getSession()
        return session?.data?.token
    },
})

export const fetchMethods = {
    get: apiClient.get.bind(apiClient),
    post: apiClient.post.bind(apiClient),
    put: apiClient.put.bind(apiClient),
    patch: apiClient.patch.bind(apiClient),
    delete: apiClient.del.bind(apiClient),
}

export const buildHeaders = async () => {
    const session = await getSession()
    return {
        Authorization: `Bearer ${session?.data?.token}`,
    }
}
