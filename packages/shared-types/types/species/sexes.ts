import { PaginationData, BaseEntity, PaginationParams } from "../core";

export interface Sex extends BaseEntity {
    id: number;
    name: string;
    status: number;
}

export type SexResponse = PaginationData<Sex>

export interface SexFilter extends PaginationParams {
    name?: string;
}
