import { PaginationData, BaseEntity, PaginationParams } from "../core";
import { Class } from "./classes";

export interface Order extends BaseEntity {
    id: number;
    name: string;
    status: number;
    class: Class;
}

export type OrderResponse = PaginationData<Order>

export interface OrderFilter extends PaginationParams {
    name?: string;
    classId?: number;
}
