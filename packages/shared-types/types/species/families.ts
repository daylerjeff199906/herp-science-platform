import { PaginationData, BaseEntity, PaginationParams } from "../core";
import { Order } from "./orders";

export interface Family extends BaseEntity {
    id: number;
    name: string;
    status: number;
    order: Order;
}

export type FamilyResponse = PaginationData<Family>

export interface FamilyFilter extends PaginationParams {
    name?: string;
    orderId?: number;
}
