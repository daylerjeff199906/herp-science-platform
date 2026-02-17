'use client'

import { useState, useEffect } from 'react'
import { fetchLocalities } from '../services/localities.service'
import { LocalityFilter, PaginatedLocalitiesResponse } from '@repo/shared-types'

interface UseLocalitiesState {
  data: PaginatedLocalitiesResponse | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useLocalities = (params: LocalityFilter): UseLocalitiesState => {
  const [state, setState] = useState<UseLocalitiesState>({
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
      const data = await fetchLocalities(params)
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
