import { useQuery } from "@tanstack/react-query"
import { fetchGenera } from "../services/genera.service"
import { GenusFilter } from "@repo/shared-types"

export const useGenera = (params: GenusFilter) => {
    return useQuery({
        queryKey: ['genera', params],
        queryFn: () => fetchGenera(params),
    })
}
