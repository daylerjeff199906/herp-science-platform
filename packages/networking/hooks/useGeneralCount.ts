import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { apiClient } from '../client'
import { GeneralCounter } from '@repo/shared-types'

// Función Fetcher: Recibe los filtros y los pasa como params a Axios
const fetchGeneralCount = async (): Promise<GeneralCounter> => {
    const { data } = await apiClient.get<GeneralCounter>('/general-counter')
    return data
}

// Custom Hook: Ahora recibe el filtro como argumento
export const useGeneralCount = () => {
    return useQuery({
        queryKey: ['general-counter'],
        queryFn: () => fetchGeneralCount(),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    })
}
