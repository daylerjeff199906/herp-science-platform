'use client'
import { useState, useEffect } from 'react'
import { fetchClasses } from '../services/classes.service'
import { ClassFilter, ClassResponse } from '@repo/shared-types'

interface UseClassesState {
  data: ClassResponse | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useClasses = (params: ClassFilter): UseClassesState => {
  const [state, setState] = useState<UseClassesState>({
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
      const data = await fetchClasses(params)
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
