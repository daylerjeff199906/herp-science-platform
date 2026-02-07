import { useQuery } from "@tanstack/react-query"
import { fetchClasses } from "../services/classes.service"
import { ClassFilter } from "@repo/shared-types"

export const useClasses = (params: ClassFilter) => {
    return useQuery({
        queryKey: ['classes', params],
        queryFn: () => fetchClasses(params),
    })
}
