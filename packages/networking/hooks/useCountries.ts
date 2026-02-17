'use client'
import { useState, useEffect } from 'react'
import { fetchCountries } from '../services/countries.service'
import { CountryFilter, PaginatedCountriesResponse } from '@repo/shared-types'

interface UseCountriesState {
  data: PaginatedCountriesResponse | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useCountries = (params: CountryFilter): UseCountriesState => {
  const [state, setState] = useState<UseCountriesState>({
    data: undefined,
    isLoading: true,
    isError: false,
    error: null,
    refetch: async () => { },
  })

  const fetchData = async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      isError: false,
      error: null,
    }))
    try {
      const data = await fetchCountries(params)
      setState((prev) => ({ ...prev, data, isLoading: false }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: error instanceof Error ? error : new Error(String(error)),
      }))
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)])

  return {
    ...state,
    refetch: fetchData,
  }
}
