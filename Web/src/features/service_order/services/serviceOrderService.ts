import { api } from "../../../services/api"
import type { 
  ServiceOrder, 
  ServiceOrderListResponse, 
  ServiceOrderFormData 
} from "../types"

export const serviceOrderService = {
  getServiceOrders: async (page = 1, limit = 15, search = "") => {
    let url = `/service-orders?page=${page}&limit=${limit}`

    if (search.trim() !== "") {
      url += `&search=${encodeURIComponent(search)}`
    }

    return await api.get<ServiceOrderListResponse>(url)
  },

  createServiceOrder: async (data: ServiceOrderFormData) => {
    return await api.post<ServiceOrder>("/service-orders", data)
  },

  getServiceOrderById: async (id: string) => {
    return await api.get<ServiceOrder>(`/service-orders/${id}`)
  },

  deleteServiceOrder: async (id: string) => {
    return await api.delete<{ message: string }>(`/service-orders/${id}`)
  },
  getOrderDetail: async (id: string) => {
    return await api.get<any>(`/service-orders/detail/${id}`);
  },
}