import { useQuery } from "@tanstack/react-query"
import { fetchInstitutions } from "../services/institutions.service"
import { InstitutionFilter } from "@repo/shared-types"

export const useInstitutions = (params: InstitutionFilter) => {
    return useQuery({
        queryKey: ['institutions', params],
        queryFn: () => fetchInstitutions(params),
    })
}
