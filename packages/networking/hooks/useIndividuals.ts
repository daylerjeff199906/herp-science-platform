'use client'

import { useState, useEffect } from 'react'
import { fetchIndividuals } from '../services/individuals'
import { IndividualFilter, IndividualResponse } from '@repo/shared-types'

interface UseIndividualsState {
  data: IndividualResponse | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => Promise<void>
}

interface InfinitePage {
  data: IndividualResponse
  nextPage: number | undefined
}

interface UseInfiniteIndividualsState {
  data:
    | {
        pages: IndividualResponse[]
        pageParams: (number | undefined)[]
      }
    | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  fetchNextPage: () => Promise<void>
  hasNextPage: boolean
  isFetchingNextPage: boolean
  refetch: () => Promise<void>
}

export const useIndividuals = (
  filters: IndividualFilter
): UseIndividualsState => {
  const [state, setState] = useState<UseIndividualsState>({
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
      const data = await fetchIndividuals(filters)
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
  }, [JSON.stringify(filters)])

  return {
    ...state,
    refetch: fetchData,
  }
}

export const useInfiniteIndividuals = (
  filters: IndividualFilter
): UseInfiniteIndividualsState => {
  const [state, setState] = useState<UseInfiniteIndividualsState>({
    data: undefined,
    isLoading: true,
    isError: false,
    error: null,
    hasNextPage: true,
    isFetchingNextPage: false,
    fetchNextPage: async () => {},
    refetch: async () => {},
  })

  const fetchData = async (pageParam: number = 1) => {
    if (pageParam === 1) {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
      }))
    } else {
      setState((prev) => ({ ...prev, isFetchingNextPage: true }))
    }

    try {
      const data = await fetchIndividuals({
        ...filters,
        page: pageParam,
        hasImages: 1,
      })

      setState((prev) => {
        const hasNextPage = data.currentPage < data.totalPages
        const nextPage = hasNextPage ? data.currentPage + 1 : undefined

        if (pageParam === 1) {
          return {
            ...prev,
            data: {
              pages: [data],
              pageParams: [1],
            },
            isLoading: false,
            hasNextPage,
            isFetchingNextPage: false,
          }
        } else {
          const currentPages = prev.data?.pages || []
          return {
            ...prev,
            data: {
              pages: [...currentPages, data],
              pageParams: [...(prev.data?.pageParams || []), pageParam],
            },
            isLoading: false,
            hasNextPage,
            isFetchingNextPage: false,
          }
        }
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isFetchingNextPage: false,
        isError: true,
        error: error instanceof Error ? error : new Error(String(error)),
      }))
    }
  }

  const fetchNextPage = async () => {
    const currentPages = state.data?.pages.length || 0
    const nextPageNum = currentPages + 1
    if (state.hasNextPage && !state.isFetchingNextPage) {
      await fetchData(nextPageNum)
    }
  }

  useEffect(() => {
    fetchData(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)])

  return {
    ...state,
    fetchNextPage,
    refetch: () => fetchData(1),
  }
}
