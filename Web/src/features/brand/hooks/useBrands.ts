import { useState, useEffect, useCallback } from "react"
import { brandService } from "../services/brandServices"
import type { Brand, BrandFormData } from "../types"

export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const fetchBrands = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await brandService.getBrands(page, 15, statusFilter)

      setBrands(response.data)
      setPage(response.page)
      setLastPage(response.lastPage)
      setTotal(response.total)
    } catch (err) {
      setError("Error al cargar las marcas")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter])

  const addBrand = async (newBrand: BrandFormData) => {
    try {
      setError(null)

      const created = await brandService.createBrand(newBrand)

      setBrands((prev) => [...prev, created])
      setTotal((prev) => prev + 1)

      return created
    } catch (err) {
      setError("No se pudo crear la marca")
      console.error(err)
      throw err
    }
  }

  const updateBrand = async (id: string, brandData: Partial<BrandFormData>) => {
    try {
      setError(null)

      const updated = await brandService.updateBrand(id, brandData)

      setBrands((prev) =>
        prev.map((brand) => (brand.id === id ? updated : brand))
      )

      return updated
    } catch (err) {
      setError("No se pudo actualizar la marca")
      console.error(err)
      throw err
    }
  }

  const toggleStatus = async (brand: Brand) => {
    if (!brand.id) return

    try {
      setError(null)

      const updated = await brandService.toggleBrandStatus(brand.id)

      setBrands((prev) =>
        prev.map((item) => (item.id === brand.id ? updated : item))
      )

      return updated
    } catch (err) {
      setError("No se pudo cambiar el estado de la marca")
      console.error(err)
      throw err
    }
  }

  const removeBrand = async (id: string) => {
    try {
      setError(null)

      await brandService.deleteBrand(id)

      setBrands((prev) => prev.filter((brand) => brand.id !== id))
      setTotal((prev) => Math.max(prev - 1, 0))
    } catch (err) {
      setError("No se pudo eliminar la marca")
      console.error(err)
      throw err
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [fetchBrands])

  return {
    brands,
    loading,
    error,
    page,
    lastPage,
    total,
    setPage,
    statusFilter,
    setStatusFilter,
    refresh: fetchBrands,
    addBrand,
    updateBrand,
    toggleStatus,
    removeBrand,
  }
}