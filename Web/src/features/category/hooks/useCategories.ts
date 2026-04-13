// src/categories/hooks/useCategories.ts
import { useState, useEffect, useCallback } from "react"
import { categoryService } from "../services/categoryService"
import type { Category, CategoryFormData } from "../types"

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await categoryService.getCategories(page, 15, statusFilter)

      // Se asume que el servicio devuelve directamente el objeto: { data, page, lastPage, total }
      setCategories(response.data)
      setPage(response.page)
      setLastPage(response.lastPage)
      setTotal(response.total)
    } catch (err) {
      setError("Error al cargar las categorías")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter])

  const addCategory = async (newCategory: CategoryFormData) => {
    try {
      setError(null)

      const created = await categoryService.createCategory(newCategory)

      setCategories((prev) => [...prev, created])
      setTotal((prev) => prev + 1)

      return created
    } catch (err) {
      setError("No se pudo crear la categoría")
      console.error(err)
      throw err
    }
  }

  const updateCategory = async (id: string, categoryData: Partial<CategoryFormData>) => {
    try {
      setError(null)

      const updated = await categoryService.updateCategory(id, categoryData)

      setCategories((prev) =>
        prev.map((category) => (category.id === id ? updated : category))
      )

      return updated
    } catch (err) {
      setError("No se pudo actualizar la categoría")
      console.error(err)
      throw err
    }
  }

  const toggleStatus = async (category: Category) => {
    if (!category.id) return

    try {
      setError(null)

      const updated = await categoryService.toggleCategoryStatus(category.id)

      setCategories((prev) =>
        prev.map((item) => (item.id === category.id ? updated : item))
      )

      return updated
    } catch (err) {
      setError("No se pudo cambiar el estado de la categoría")
      console.error(err)
      throw err
    }
  }

  const removeCategory = async (id: string) => {
    try {
      setError(null)

      await categoryService.deleteCategory(id)

      setCategories((prev) => prev.filter((category) => category.id !== id))
      setTotal((prev) => Math.max(prev - 1, 0))
    } catch (err) {
      setError("No se pudo eliminar la categoría")
      console.error(err)
      throw err
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    page,
    lastPage,
    total,
    setPage,
    statusFilter,
    setStatusFilter,
    refresh: fetchCategories,
    addCategory,
    updateCategory,
    toggleStatus,
    removeCategory,
  }
}