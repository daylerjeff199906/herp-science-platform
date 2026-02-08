import { useQuery } from "@tanstack/react-query"
import { fetchCountries } from "../services/countries.service"
import { CountryFilter } from "@repo/shared-types"

export const useCountries = (params: CountryFilter) => {
  return useQuery({
    queryKey: ['countries', params],
    queryFn: () => fetchCountries(params),
  })
}
