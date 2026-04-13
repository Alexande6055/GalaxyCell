import { api } from "../../../services/api";
import type { Category, CategoryListResponse, CategoryFormData } from "../types";

export const categoryService = {
  // Obtener categorías con paginación y filtro de estado
  getCategories: async (page = 1, limit = 15, isActive = "all") => {
    let url = `/category?page=${page}&limit=${limit}`;

    if (isActive !== "all") {
      url += `&isActive=${isActive}`;
    }

    // Retorna la promesa de Axios completa
    return await api.get<CategoryListResponse>(url);
  },

  createCategory: async (data: CategoryFormData) => {
    return await api.post<Category>("/category", data);
  },

  updateCategory: async (id: string, data: Partial<CategoryFormData>) => {
    return await api.patch<Category>(`/category/${id}`, data);
  },

  // Método específico para el toggle de estado
  toggleCategoryStatus: async (id: string) => {
    // El objeto vacío {} es obligatorio para el método patch de Axios
    return await api.patch<Category>(`/category/${id}/toggle`, {});
  },

  getCategoryById: async (id: string) => {
    return await api.get<Category>(`/category/${id}`);
  },

  deleteCategory: async (id: string) => {
    return await api.delete<{ message: string }>(`/category/${id}`);
  },
};