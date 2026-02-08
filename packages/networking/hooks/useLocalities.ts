import { useQuery } from "@tanstack/react-query"
import { fetchLocalities } from "../services/localities.service"
import { LocalityFilter } from "@repo/shared-types"

export const useLocalities = (params: LocalityFilter) => {
    return useQuery({
        queryKey: ['localities', params],
        queryFn: () => fetchLocalities(params),
    })
}
