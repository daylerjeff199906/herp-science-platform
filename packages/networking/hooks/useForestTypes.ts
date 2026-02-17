'use client'

import { useState, useEffect } from 'react'
import { fetchForestTypes } from '../services/forest-types.service'
import { ForestTypeFilter, ForestTypeResponse } from '@repo/shared-types'

interface UseForestTypesState {
  data: ForestTypeResponse | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useForestTypes = (
  params: ForestTypeFilter
): UseForestTypesState => {
  const [state, setState] = useState<UseForestTypesState>({
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
      const data = await fetchForestTypes(params)
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
