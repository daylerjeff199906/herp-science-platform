import { useQuery } from "@tanstack/react-query"
import { fetchSexes } from "../services/sexes.service"
import { SexFilter } from "@repo/shared-types"

export const useSexes = (params: SexFilter) => {
    return useQuery({
        queryKey: ['sexes', params],
        queryFn: () => fetchSexes(params),
    })
}