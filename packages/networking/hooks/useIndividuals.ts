import { useQuery, useInfiniteQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchIndividuals } from '../services/individuals'
import { IndividualFilter } from '@repo/shared-types'

export const useIndividuals = (filters: IndividualFilter) => {
    return useQuery({
        queryKey: ['individuals', filters],
        queryFn: () => fetchIndividuals(filters),
        placeholderData: keepPreviousData,
    })
}

export const useInfiniteIndividuals = (filters: IndividualFilter) => {
    return useInfiniteQuery({
        queryKey: ['individuals', 'infinite', filters],
        queryFn: ({ pageParam = 1 }) => fetchIndividuals({ ...filters, page: pageParam, hasImages: 1 }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.currentPage < lastPage.totalPages) {
                return lastPage.currentPage + 1
            }
            return undefined
        },
        placeholderData: keepPreviousData,
    })
}
