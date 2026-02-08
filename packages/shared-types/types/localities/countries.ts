import { PaginatedResponse, BaseEntity } from '../core'
export interface Country extends BaseEntity {
  id: string // Ej: "US"
  name: string // Ej: "United States"
  status: number // Ej: 1 (1 = active, 0 = inactive)
}

export interface PaginatedCountriesResponse extends PaginatedResponse<Country> { }

export interface CountryFilter {
  name?: string // Filtro por nombre del país (parcial, case-insensitive)
  page?: number // Número de página para paginación
  pageSize?: number // Tamaño de página para paginación
}
