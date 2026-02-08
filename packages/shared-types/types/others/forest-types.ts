import { PaginatedResponse, BaseEntity } from '../core'

export interface ForestType extends BaseEntity {
    id: number;
    name: string;
    status: number
}

export type ForestTypeResponse = PaginatedResponse<ForestType>

export interface ForestTypeFilter {
    name?: string;
    page?: number;
    pageSize?: number;
}