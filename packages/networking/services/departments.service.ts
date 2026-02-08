'use server'
import { apiClient } from '../client'
import { department, DepartmentFilter, PaginatedDepartmentsResponse } from '@repo/shared-types'
import { ENDPOINTS } from "../config/endpoints-url"

export const fetchDepartments = async (params: DepartmentFilter): Promise<PaginatedDepartmentsResponse> => {
    const response = await apiClient.get<PaginatedDepartmentsResponse>(ENDPOINTS.DEPARTMENTS.GET_PAGINATED, { params })
    return response.data
}

export const fetchDepartmentById = async (id: number): Promise<department> => {
    const response = await apiClient.get<department>(ENDPOINTS.DEPARTMENTS.GET_BY_ID(id))
    return response.data
}
