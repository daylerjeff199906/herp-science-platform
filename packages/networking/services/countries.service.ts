'use server'
import { apiClient } from '../client'
import { Country, CountryFilter, PaginatedCountriesResponse } from '@repo/shared-types'
import { ENDPOINTS } from "../config/endpoints-url"

export const fetchCountries = async (params: CountryFilter): Promise<PaginatedCountriesResponse> => {
    const response = await apiClient.get<PaginatedCountriesResponse>(ENDPOINTS.COUNTRIES.GET_PAGINATED, { params })
    return response.data
}

export const fetchCountryById = async (id: string): Promise<Country> => {
    const response = await apiClient.get<Country>(ENDPOINTS.COUNTRIES.GET_BY_ID(id))
    return response.data
}
