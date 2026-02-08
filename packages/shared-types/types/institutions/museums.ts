import { PaginatedResponse, BaseEntity } from '../core'
import { Institution } from './institutions'

export interface Museum extends BaseEntity {
    id: string
    name: string
    acronym: string
    status: number
    institution: Institution
}

export type MuseumsResponse = PaginatedResponse<Museum>

export interface MuseumFilter {
    searchTerm?: string // Filtro por nombre del país (parcial, case-insensitive)
    page?: number // Número de página para paginación
    pageSize?: number // Tamaño de página para paginación
    institution_id?: string // Filtro por ID de la institución
}
