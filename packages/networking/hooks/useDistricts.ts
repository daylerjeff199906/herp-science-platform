'use client'

import { useState, useEffect } from 'react'
import { fetchDistricts } from '../services/districts.service'
import { DistrictFilter, PaginatedDistrictsResponse } from '@repo/shared-types'

interface UseDistrictsState {
  data: PaginatedDistrictsResponse | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useDistricts = (params: DistrictFilter): UseDistrictsState => {
  const [state, setState] = useState<UseDistrictsState>({
    data: undefined,
    isLoading: true,
    isError: false,
    error: null,
    refetch: async () => {},
  })

  const fetchData = async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      isError: false,
      error: null,
    }))
    try {
      const data = await fetchDistricts(params)
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
