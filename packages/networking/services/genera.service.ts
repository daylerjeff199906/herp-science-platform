'use server'
import { apiClient } from '../client'
import { GenusResponse, GenusFilter, Genus } from '@repo/shared-types';
import { ENDPOINTS } from "../config/endpoints-url";

export const fetchGenera = async (params: GenusFilter): Promise<GenusResponse> => {
    const response = await apiClient.get<GenusResponse>(ENDPOINTS.GENERA.GET_PAGINATED, { params });
    return response.data;
}

export const fetchGenusById = async (id: number): Promise<Genus> => {
    const response = await apiClient.get<Genus>(ENDPOINTS.GENERA.GET_BY_ID(id));
    return response.data;
}
