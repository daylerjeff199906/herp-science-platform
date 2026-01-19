import { PaginatedResponse } from '../core'
import { province } from './provinces'

export interface district {
  id: number
  name: string
  ubigeo: string
  status: number
  createdAt: string
  updatedAt: string
  province: province
}

export type PaginatedDistrictsResponse = PaginatedResponse<district>

export interface DistrictFilter {
  name?: string // Filtro por nombre del distrito (parcial, case-insensitive)
  province_id?: number // Filtro por ID de provincia
  page?: number // Número de página para paginación
  pageSize?: number // Tamaño de página para paginación
}
