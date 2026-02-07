import { PaginationData, BaseEntity, PaginationParams } from "../core";

export interface Class extends BaseEntity {
    id: number;
    name: string;
    status: number;
}

export type ClassResponse = PaginationData<Class>

export interface ClassFilter extends PaginationParams {
    name?: string;
}
