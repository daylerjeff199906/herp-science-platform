import { apiClient } from '../client'
import { IndividualFilter, IndividualResponse } from '@repo/shared-types'

const cleanFilters = <T extends object>(filters: T): Partial<T> => {
    const cleaned: Partial<T> = {};

    (Object.keys(filters) as Array<keyof T>).forEach((key) => {
        const value = filters[key];

        // Skip null, undefined, or empty string
        if (value === null || value === undefined || value === '') {
            return;
        }

        // Handle nested objects (TaxonomicFilter, GeographicFilter, DateRange, TimeRange)
        if (typeof value === 'object' && !Array.isArray(value)) {
            const nestedCleaned = cleanFilters(value as object);
            if (Object.keys(nestedCleaned).length > 0) {
                cleaned[key] = nestedCleaned as T[keyof T];
            }
        } else {
            cleaned[key] = value;
        }
    });

    return cleaned;
}

export const fetchIndividuals = async (filters: IndividualFilter): Promise<IndividualResponse> => {
    const payload = cleanFilters(filters);
    try {
        const { data } = await apiClient.post<IndividualResponse>('/individuals/query', payload)
        return data
    } catch (error: any) {
        // Handle 403 Forbidden gracefully -> return empty results
        if (error.response?.status === 403) {
            return {
                data: [],
                currentPage: 1,
                totalPages: 1, // Avoid 0 if generic pagination breaks, but 0 is usually safer. Set 1 to be neutral. Or 0.
                totalItems: 0
            }
        }
        throw error;
    }
}
