'use server'
import { apiClient } from '../client'
import { SpeciesData, SpeciesParams, Species } from '@repo/shared-types';
import { ENDPOINTS } from "../config/endpoints-url";

export const fetchSpecies = async (params: SpeciesParams): Promise<SpeciesData> => {
    const response = await apiClient.get<SpeciesData>(ENDPOINTS.SPECIES.GET_PAGINATED, { params });
    return response.data;
}

export const fetchSpeciesById = async (id: number): Promise<Species> => {
    const response = await apiClient.get<Species>(ENDPOINTS.SPECIES.GET_BY_ID(id));
    return response.data;
}
