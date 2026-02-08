'use server'
import { apiClient } from '../client'
import { district, DistrictFilter, PaginatedDistrictsResponse } from '@repo/shared-types'
import { ENDPOINTS } from "../config/endpoints-url"

export const fetchDistricts = async (params: DistrictFilter): Promise<PaginatedDistrictsResponse> => {
    const response = await apiClient.get<PaginatedDistrictsResponse>(ENDPOINTS.DISTRICTS.GET_PAGINATED, { params })
    return response.data
}

export const fetchDistrictById = async (id: number): Promise<district> => {
    const response = await apiClient.get<district>(ENDPOINTS.DISTRICTS.GET_BY_ID(id))
    return response.data
}
