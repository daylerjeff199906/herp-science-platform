import { PaginatedResponse } from './core'
export interface Country {
  id: string // Ej: "US"
  name: string // Ej: "United States"
  status: number // Ej: 1 (1 = active, 0 = inactive)
  createdAt: string // Ej: "2023-01-15T12:34:56Z"
  updatedAt: string // Ej: "2023-06-20T08:22:10Z"
}

export interface PaginatedCountriesResponse extends PaginatedResponse<Country> {}

export interface CountryFilter {
  name?: string // Filtro por nombre del país (parcial, case-insensitive)
  page?: number // Número de página para paginación
  pageSize?: number // Tamaño de página para paginación
}
