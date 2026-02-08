'use server'
import { apiClient } from '../client'
import { Museum, MuseumFilter, MuseumsResponse } from '@repo/shared-types'
import { ENDPOINTS } from "../config/endpoints-url"

export const fetchMuseums = async (params: MuseumFilter): Promise<MuseumsResponse> => {
    const response = await apiClient.get<MuseumsResponse>(ENDPOINTS.MUSEUMS.GET_PAGINATED, { params })
    return response.data || { data: [], currentPage: 1, totalPages: 1, totalItems: 0 }
}

export const fetchMuseumById = async (id: string): Promise<Museum> => {
    const response = await apiClient.get<Museum>(ENDPOINTS.MUSEUMS.GET_BY_ID(id))
    return response.data
}
