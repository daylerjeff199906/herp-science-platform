import { useQuery } from "@tanstack/react-query"
import { fetchDistricts } from "../services/districts.service"
import { DistrictFilter } from "@repo/shared-types"

export const useDistricts = (params: DistrictFilter) => {
    return useQuery({
        queryKey: ['districts', params],
        queryFn: () => fetchDistricts(params),
    })
}
