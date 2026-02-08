import { useQuery } from "@tanstack/react-query"
import { fetchProvinces } from "../services/provinces.service"
import { ProvinceFilter } from "@repo/shared-types"

export const useProvinces = (params: ProvinceFilter) => {
    return useQuery({
        queryKey: ['provinces', params],
        queryFn: () => fetchProvinces(params),
    })
}
