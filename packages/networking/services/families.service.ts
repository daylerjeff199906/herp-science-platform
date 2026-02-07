import { apiClient } from '../client'
import { FamilyResponse, FamilyFilter, Family } from '@repo/shared-types';
import { ENDPOINTS } from "../config/endpoints-url";

export const fetchFamilies = async (params: FamilyFilter): Promise<FamilyResponse> => {
    const response = await apiClient.get<FamilyResponse>(ENDPOINTS.FAMILIES.GET_PAGINATED, { params });
    return response.data;
}

export const fetchFamilyById = async (id: number): Promise<Family> => {
    const response = await apiClient.get<Family>(ENDPOINTS.FAMILIES.GET_BY_ID(id));
    return response.data;
}
