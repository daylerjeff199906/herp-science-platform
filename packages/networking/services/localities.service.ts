'use server'
import { apiClient } from '../client'
import { locality, LocalityFilter, PaginatedLocalitiesResponse } from '@repo/shared-types'
import { ENDPOINTS } from "../config/endpoints-url"

export const fetchLocalities = async (params: LocalityFilter): Promise<PaginatedLocalitiesResponse> => {
    const response = await apiClient.get<PaginatedLocalitiesResponse>(ENDPOINTS.LOCALITIES.GET_PAGINATED, { params })
    return response.data
}

export const fetchLocalityById = async (id: number): Promise<locality> => {
    const response = await apiClient.get<locality>(ENDPOINTS.LOCALITIES.GET_BY_ID(id))
    return response.data
}
