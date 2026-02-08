import { useQuery } from "@tanstack/react-query"
import { fetchDepartments } from "../services/departments.service"
import { DepartmentFilter } from "@repo/shared-types"

export const useDepartments = (params: DepartmentFilter) => {
    return useQuery({
        queryKey: ['departments', params],
        queryFn: () => fetchDepartments(params),
    })
}
