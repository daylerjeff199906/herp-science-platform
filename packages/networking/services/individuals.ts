import { apiClient } from '../client'
import { IndividualFilter, IndividualResponse } from '@repo/shared-types'

const cleanFilters = <T extends object>(filters: T): Partial<T> => {
    const cleaned: any = {};
    for (const key in filters) {
        const value = (filters as any)[key];

        // Skip null, undefined, or empty string
        if (value === null || value === undefined || value === '') {
            continue;
        }

        // Handle nested objects (TaxonomicFilter, GeographicFilter, DateRange, TimeRange)
        if (typeof value === 'object' && !Array.isArray(value)) {
            const nestedCleaned = cleanFilters(value);
            if (Object.keys(nestedCleaned).length > 0) {
                cleaned[key] = nestedCleaned;
            }
        } else {
            cleaned[key] = value;
        }
    }
    return cleaned;
}

export const fetchIndividuals = async (filters: IndividualFilter): Promise<IndividualResponse> => {
    const payload = cleanFilters(filters);
    const { data } = await apiClient.post<IndividualResponse>('/individuals/query', payload)
    return data
}
