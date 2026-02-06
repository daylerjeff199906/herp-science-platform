import { useQuery } from "@tanstack/react-query"
import { fetchOrders } from "../services/orders.service"
import { OrderFilter } from "@repo/shared-types"

export const useOrders = (params: OrderFilter) => {
    return useQuery({
        queryKey: ['orders', params],
        queryFn: () => fetchOrders(params),
    })
}
