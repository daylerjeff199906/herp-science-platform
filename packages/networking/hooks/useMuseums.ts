'use client'

import { useState, useEffect } from 'react'
import { fetchMuseums } from '../services/museums.service'
import { MuseumFilter, MuseumsResponse } from '@repo/shared-types'

interface UseMuseumsState {
  data: MuseumsResponse | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useMuseums = (params: MuseumFilter): UseMuseumsState => {
  const [state, setState] = useState<UseMuseumsState>({
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
      const data = await fetchMuseums(params)
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
