import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchIndividuals } from '../services/individuals'
import { IndividualFilter } from '@repo/shared-types'

export const useIndividuals = (filters: IndividualFilter) => {
    return useQuery({
        queryKey: ['individuals', filters],
        queryFn: () => fetchIndividuals(filters),
        placeholderData: keepPreviousData,
    })
}
