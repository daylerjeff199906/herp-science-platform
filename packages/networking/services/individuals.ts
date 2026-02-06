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
    const { data } = await apiClient.post<IndividualResponse>('/individuals/query', payload)
    console.log(data)
    return data
}
