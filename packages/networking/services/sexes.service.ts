'use server'
import { apiClient } from '../client'
import { SexResponse, SexFilter, Sex } from '@repo/shared-types';
import { ENDPOINTS } from "../config";

export const fetchSexes = async (params: SexFilter): Promise<SexResponse> => {
    const response = await apiClient.get<SexResponse>(ENDPOINTS.SEXES.GET_PAGINATED, { params });
    return response.data;
}

export const fetchSexById = async (id: number): Promise<Sex> => {
    const response = await apiClient.get<Sex>(ENDPOINTS.SEXES.GET_BY_ID(id));
    return response.data;
}