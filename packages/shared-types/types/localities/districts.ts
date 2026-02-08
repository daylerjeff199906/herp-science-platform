import { PaginatedResponse, BaseEntity } from '../core'
import { province } from './provinces'

export interface district extends BaseEntity {
  name: string
  ubigeo: string
  status: number
  province: province
}

export type PaginatedDistrictsResponse = PaginatedResponse<district>

export interface DistrictFilter {
  name?: string // Filtro por nombre del distrito (parcial, case-insensitive)
  province_id?: number // Filtro por ID de provincia
  page?: number // Número de página para paginación
  pageSize?: number // Tamaño de página para paginación
}
