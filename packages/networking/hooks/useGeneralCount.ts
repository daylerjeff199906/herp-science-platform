'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '../client'
import { GeneralCounter } from '@repo/shared-types'

interface UseGeneralCountState {
  data: GeneralCounter | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => Promise<void>
}

const fetchGeneralCount = async (): Promise<GeneralCounter> => {
  const { data } = await apiClient.get<GeneralCounter>('/general-counter')
  return data
}

export const useGeneralCount = (): UseGeneralCountState => {
  const [state, setState] = useState<UseGeneralCountState>({
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
      const data = await fetchGeneralCount()
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
  }, [])

  return {
    ...state,
    refetch: fetchData,
  }
}
