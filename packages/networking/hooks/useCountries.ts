import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { apiClient } from '../client'
import { CountryFilter, PaginatedCountriesResponse } from '@repo/shared-types'

// Función Fetcher: Recibe los filtros y los pasa como params a Axios
const fetchCountries = async (
  filter: CountryFilter
): Promise<PaginatedCountriesResponse> => {
  const cleanFilter = Object.fromEntries(
    Object.entries(filter).filter(
      ([_, value]) => value !== '' && value !== undefined
    )
  )
  const { data } = await apiClient.get<PaginatedCountriesResponse>(
    '/countries',
    {
      params: cleanFilter,
    }
  )
  return data
}

// Custom Hook: Ahora recibe el filtro como argumento
export const useCountries = (filter: CountryFilter) => {
  return useQuery({
    queryKey: ['countries', filter],
    queryFn: () => fetchCountries(filter),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}
