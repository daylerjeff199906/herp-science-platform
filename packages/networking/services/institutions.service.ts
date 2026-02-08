'use server'
import { apiClient } from '../client'
import { Institution, InstitutionFilter, InstitutionsResponse } from '@repo/shared-types'
import { ENDPOINTS } from "../config/endpoints-url"

export const fetchInstitutions = async (params: InstitutionFilter): Promise<InstitutionsResponse> => {
    const response = await apiClient.get<InstitutionsResponse>(ENDPOINTS.INSTITUTIONS.GET_PAGINATED, { params })
    return response.data || { data: [], currentPage: 1, totalPages: 1, totalItems: 0 }
}

export const fetchInstitutionById = async (id: string): Promise<Institution> => {
    const response = await apiClient.get<Institution>(ENDPOINTS.INSTITUTIONS.GET_BY_ID(id))
    return response.data
}
