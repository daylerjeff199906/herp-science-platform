'use client'

import { useState, useEffect } from 'react'
import { fetchInstitutions } from '../services/institutions.service'
import { InstitutionFilter, InstitutionsResponse } from '@repo/shared-types'

interface UseInstitutionsState {
  data: InstitutionsResponse | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useInstitutions = (
  params: InstitutionFilter
): UseInstitutionsState => {
  const [state, setState] = useState<UseInstitutionsState>({
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
      const data = await fetchInstitutions(params)
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
