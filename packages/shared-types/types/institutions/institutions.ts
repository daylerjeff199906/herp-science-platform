import { PaginatedResponse, BaseEntity } from '../core'

export interface Institution extends BaseEntity {
    id: string
    name: string
    status: number
}

export type InstitutionsResponse = PaginatedResponse<Institution>


export interface InstitutionFilter {
    name?: string // Filtro por nombre del país (parcial, case-insensitive)
    page?: number // Número de página para paginación
    pageSize?: number // Tamaño de página para paginación
}
