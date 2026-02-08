'use server'
import { apiClient } from '../client'
import { ForestType, ForestTypeFilter, ForestTypeResponse } from '@repo/shared-types'
import { ENDPOINTS } from "../config/endpoints-url"

export const fetchForestTypes = async (params: ForestTypeFilter): Promise<ForestTypeResponse> => {
    const response = await apiClient.get<ForestTypeResponse>(ENDPOINTS.FOREST_TYPES.GET_PAGINATED, { params })
    return response.data || { data: [], currentPage: 1, totalPages: 1, totalItems: 0 }
}

export const fetchForestTypeById = async (id: number): Promise<ForestType> => {
    const response = await apiClient.get<ForestType>(ENDPOINTS.FOREST_TYPES.GET_BY_ID(id))
    return response.data
}
