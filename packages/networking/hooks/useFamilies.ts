import { useQuery } from "@tanstack/react-query"
import { fetchFamilies } from "../services/families.service"
import { FamilyFilter } from "@repo/shared-types"

export const useFamilies = (params: FamilyFilter) => {
    return useQuery({
        queryKey: ['families', params],
        queryFn: () => fetchFamilies(params),
    })
}
