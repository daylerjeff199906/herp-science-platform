export interface PaginatedResponse<T> {
  data: T[]
  currentPage: number
  totalPages: number
  totalItems: number
}

export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined
}>
export type Params = Promise<{ [key: string]: string | string[] | undefined }>
