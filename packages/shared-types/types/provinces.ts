import { PaginatedResponse } from './core'
import { department } from './departments'

export interface province {
  id: number
  name: string
  status: number
  createdAt: string
  updatedAt: string
  department: department
}

export type provincesResponse = PaginatedResponse<province>

export interface ProvinceFilter {
  name?: string // Filtro por nombre de la provincia (parcial, case-insensitive)
  department_id?: number // Filtro por ID de departamento
  page?: number // Número de página para paginación
  pageSize?: number // Tamaño de página para paginación
}
