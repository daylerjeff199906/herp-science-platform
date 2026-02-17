'use client'

import { useState, useEffect } from 'react'
import { fetchFamilies } from '../services/families.service'
import { FamilyFilter, FamilyResponse } from '@repo/shared-types'

interface UseFamiliesState {
  data: FamilyResponse | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useFamilies = (params: FamilyFilter): UseFamiliesState => {
  const [state, setState] = useState<UseFamiliesState>({
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
      const data = await fetchFamilies(params)
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
