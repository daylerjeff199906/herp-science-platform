'use client'

import { useState, useEffect } from 'react'
import { fetchSexes } from '../services/sexes.service'
import { SexFilter, SexResponse } from '@repo/shared-types'

interface UseSexesState {
  data: SexResponse | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useSexes = (params: SexFilter): UseSexesState => {
  const [state, setState] = useState<UseSexesState>({
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
      const data = await fetchSexes(params)
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
