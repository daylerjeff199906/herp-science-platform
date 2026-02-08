'use server'
import { apiClient } from '../client'
import { province, ProvinceFilter, provincesResponse } from '@repo/shared-types'
import { ENDPOINTS } from "../config/endpoints-url"

export const fetchProvinces = async (params: ProvinceFilter): Promise<provincesResponse> => {
    const response = await apiClient.get<provincesResponse>(ENDPOINTS.PROVINCES.GET_PAGINATED, { params })
    return response.data
}

export const fetchProvinceById = async (id: number): Promise<province> => {
    const response = await apiClient.get<province>(ENDPOINTS.PROVINCES.GET_BY_ID(id))
    return response.data
}
