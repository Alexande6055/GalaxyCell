import { api } from "../../../services/api"
import type {
  ServiceDetail,
  ServiceDetailListResponse,
  ServiceDetailFormData,
  UpdateServiceDetailStatusFormData,
  EquipmentType
} from "../types"

export const serviceDetailService = {
  getServiceDetails: async (
    serviceOrderId: string,
    page = 1,
    limit = 15,
    status?: string
  ) => {
    let url = `/service-details?serviceOrderId=${serviceOrderId}&page=${page}&limit=${limit}`

    if (status) {
      url += `&status=${status}`
    }

    return await api.get<ServiceDetailListResponse>(url)
  },

  createServiceDetail: async (data: ServiceDetailFormData) => {
    return await api.post<ServiceDetail>("/service-details", data)
  },


updateServiceDetailStatus: async (
    id: string,
    serviceOrderId: string,
    data: UpdateServiceDetailStatusFormData
  ) => {
    // Si tu backend todavía requiere el serviceOrderId por Query, lo dejamos así:
    return await api.patch<ServiceDetail>(
      `/service-details/status/${id}?serviceOrderId=${serviceOrderId}`,
      data
    );
  }
,
  getServiceDetailById: async (id: string, serviceOrderId: string) => {
    return await api.get<ServiceDetail>(
      `/service-details/${id}?serviceOrderId=${serviceOrderId}`
    )
  },

  deleteServiceDetail: async (id: string, serviceOrderId: string) => {
    return await api.delete<{ message: string }>(
      `/service-details/${id}?serviceOrderId=${serviceOrderId}`
    )
  },

  getEquipmentTypes: async () => {
    return await api.get<EquipmentType[]>("/equipment-types")
  },
}