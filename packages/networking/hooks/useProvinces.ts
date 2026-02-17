'use client'

import { useState, useEffect } from 'react'
import { fetchProvinces } from '../services/provinces.service'
import { ProvinceFilter, provincesResponse } from '@repo/shared-types'

interface UseProvincesState {
  data: provincesResponse | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useProvinces = (params: ProvinceFilter): UseProvincesState => {
  const [state, setState] = useState<UseProvincesState>({
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
      const data = await fetchProvinces(params)
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
