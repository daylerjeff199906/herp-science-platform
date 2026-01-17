import { Country } from './countries'
import { PaginatedResponse } from './core'

export interface department {
  id: number
  name: string
  status: number
  createdAt: string
  updatedAt: string
  country: Country
}

export interface PaginatedDepartmentsResponse extends PaginatedResponse<department> {}

export interface DepartmentFilter {
  name?: string // Filtro por nombre del departamento (parcial, case-insensitive)
  country_id?: string // Filtro por ID de país
  page?: number // Número de página para paginación
  pageSize?: number // Tamaño de página para paginación
}
