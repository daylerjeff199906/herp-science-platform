import { useQuery } from "@tanstack/react-query"
import { fetchForestTypes } from "../services/forest-types.service"
import { ForestTypeFilter } from "@repo/shared-types"

export const useForestTypes = (params: ForestTypeFilter) => {
    return useQuery({
        queryKey: ['forest-types', params],
        queryFn: () => fetchForestTypes(params),
    })
}
