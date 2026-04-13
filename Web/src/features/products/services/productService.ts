import { api } from "../../../services/api"
import type { Product, ProductListResponse, ProductFilters } from "../types"

export const productService = {
  /**
   * Obtiene la lista de productos con filtros y paginación
   */
  getProducts: async ({
    page = 1,
    limit = 15,
    search = "",
    category = "",
    brand = "",
    isActive = "all",
  }: ProductFilters = {}) => {
    const params = new URLSearchParams()

    params.append("page", String(page)) 
    params.append("limit", String(limit))

    if (search.trim()) {
      params.append("search", search.trim())
    }

    if (category.trim()) {
      params.append("category", category.trim())
    }

    if (brand.trim()) {
      params.append("brand", brand.trim())
    }

    if (isActive && isActive !== "all") {
      params.append("isActive", isActive)
    }

    // El servicio api.get ya maneja la respuesta de Axios/Fetch según tu config
    return await api.get<ProductListResponse>(`/product?${params.toString()}`)
  },

  /**
   * Crea un producto enviando FormData (incluye imágenes)
   */
  createProduct: async (data: FormData) => {
    // Ya NO enviamos el objeto de headers manualmente, 
    // la función postFile en api.ts se encarga de todo.
    return await api.postFile<Product>("/product", data)
  },

  /**
   * Actualiza un producto existente con FormData
   */
  updateProduct: async (id: number | string, data: FormData) => {
    // Solo pasamos el endpoint y el FormData
    return await api.patchFile<Product>(`/product/${id}`, data)
  },

  /**
   * Obtiene un producto por su ID (UUID o Number)
   */
  getProductById: async (id: number | string) => {
    return await api.get<Product>(`/product/${id}`)
  },

  /**
   * Cambia el estado (Activo/Inactivo) del producto
   */
  toggleProductStatus: async (id: number | string) => {
    // Usamos el patch normal porque aquí no enviamos archivos, solo un body vacío
    return await api.patch<Product>(`/product/${id}/toggle`, {})
  },

  /**
   * Eliminación lógica o física del producto
   */
  // deleteProduct: async (id: number | string) => {
  //   return await api.delete<{ message: string }>(`/product/${id}`)
  // },

  getProductDetail: async (id: string | number) => {
    // Usamos el nuevo endpoint que definimos en el controlador del backend
    return await api.get<Product>(`/product/detail/${id}`);
  },
}