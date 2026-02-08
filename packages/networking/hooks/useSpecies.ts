import { useQuery } from "@tanstack/react-query"
import { fetchSpecies } from "../services/species.service"
import { SpeciesParams } from "@repo/shared-types"

export const useSpecies = (params: SpeciesParams) => {
    return useQuery({
        queryKey: ['species', params],
        queryFn: () => fetchSpecies(params),
    })
}
