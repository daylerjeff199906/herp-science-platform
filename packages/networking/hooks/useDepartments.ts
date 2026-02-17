'use client'

import { useState, useEffect } from 'react'
import { fetchDepartments } from '../services/departments.service'
import {
  DepartmentFilter,
  PaginatedDepartmentsResponse,
} from '@repo/shared-types'

interface UseDepartmentsState {
  data: PaginatedDepartmentsResponse | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useDepartments = (
  params: DepartmentFilter
): UseDepartmentsState => {
  const [state, setState] = useState<UseDepartmentsState>({
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
      const data = await fetchDepartments(params)
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
