import { useQuery } from "@tanstack/react-query"
import { fetchMuseums } from "../services/museums.service"
import { MuseumFilter } from "@repo/shared-types"

export const useMuseums = (params: MuseumFilter) => {
    return useQuery({
        queryKey: ['museums', params],
        queryFn: () => fetchMuseums(params),
    })
}
