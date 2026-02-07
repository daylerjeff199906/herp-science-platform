import { apiClient } from '../client'
import { OrderResponse, OrderFilter, Order } from '@repo/shared-types';
import { ENDPOINTS } from "../config/endpoints-url";

export const fetchOrders = async (params: OrderFilter): Promise<OrderResponse> => {
    const response = await apiClient.get<OrderResponse>(ENDPOINTS.ORDERS.GET_PAGINATED, { params });
    return response.data;
}

export const fetchOrderById = async (id: number): Promise<Order> => {
    const response = await apiClient.get<Order>(ENDPOINTS.ORDERS.GET_BY_ID(id));
    return response.data;
}
