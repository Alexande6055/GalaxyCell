import { api } from "../../../services/api"
import type { Brand, BrandListResponse, BrandFormData } from "../types"

export const brandService = {
  getBrands: async (page = 1, limit = 15, isActive = "all") => {
    let url = `/brand?page=${page}&limit=${limit}`

    if (isActive !== "all") {
      url += `&isActive=${isActive}`
    }

    return await api.get<BrandListResponse>(url)
  },

  createBrand: async (data: BrandFormData) => {
    return await api.post<Brand>("/brand", data)
  },

  updateBrand: async (id: string, data: Partial<BrandFormData>) => {
    return await api.patch<Brand>(`/brand/${id}`, data)
  },

  toggleBrandStatus: async (id: string) => {
    return await api.patch<Brand>(`/brand/${id}/toggle`, {})
  },

  getBrandById: async (id: string) => {
    return await api.get<Brand>(`/brand/${id}`)
  },

  deleteBrand: async (id: string) => {
    return await api.delete<{ message: string }>(`/brand/${id}`)
  },
}