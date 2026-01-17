import { PaginatedResponse } from './core'
import { district } from './districts'

export interface locality {
  id: number
  name: string
  description: string
  status: number
  createdAt: string
  updatedAt: string
  district: district
}

export type PaginatedLocalitiesResponse = PaginatedResponse<locality>

export interface LocalityFilter {
  name?: string // Filtro por nombre de la localidad (parcial, case-insensitive)
  district_id?: number // Filtro por ID de distrito
  page?: number // Número de página para paginación
  pageSize?: number // Tamaño de página para paginación
}
