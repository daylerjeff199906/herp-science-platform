import { PaginationData, BaseEntity, PaginationParams } from "../core";
import { Family } from "./families";

export interface Genus extends BaseEntity {
    id: number;
    name: string;
    status: number;
    family: Family;
}

export type GenusResponse = PaginationData<Genus>

export interface GenusFilter extends PaginationParams {
    name?: string;
    familyId?: number;
}
