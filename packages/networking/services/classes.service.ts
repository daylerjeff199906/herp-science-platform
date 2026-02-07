import { apiClient } from '../client'
import { ClassResponse, ClassFilter, Class } from '@repo/shared-types';
import { ENDPOINTS } from "../config/endpoints-url";

export const fetchClasses = async (params: ClassFilter): Promise<ClassResponse> => {
    const response = await apiClient.get<ClassResponse>(ENDPOINTS.CLASSES.GET_PAGINATED, { params });
    return response.data;
}

export const fetchClassById = async (id: number): Promise<Class> => {
    const response = await apiClient.get<Class>(ENDPOINTS.CLASSES.GET_BY_ID(id));
    return response.data;
}
