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

export interface PaginationData<T> {
  data: T[]
  currentPage: number
  totalPages: number
  totalItems: number
}

export interface BaseEntity {
  createdAt: string
  updatedAt: string
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}