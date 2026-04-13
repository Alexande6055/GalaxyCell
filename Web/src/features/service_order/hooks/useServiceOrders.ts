import { useState, useEffect, useCallback } from "react"
import { serviceOrderService } from "../services/serviceOrderService"
import type { ServiceOrder, ServiceOrderFormData } from "../types"

export const useServiceOrders = () => {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [search, setSearch] = useState<string>("")

  const fetchServiceOrders = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await serviceOrderService.getServiceOrders(page, 15, search)

      setServiceOrders(response.data)
      setPage(response.meta.page)
      setLastPage(response.meta.lastPage)
      setTotal(response.meta.total)
    } catch (err) {
      setError("Error al cargar las órdenes de servicio")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  const addServiceOrder = async (newOrder: ServiceOrderFormData) => {
    try {
      setError(null)

      const created = await serviceOrderService.createServiceOrder(newOrder)

      setServiceOrders((prev) => [created, ...prev])
      setTotal((prev) => prev + 1)

      return created
    } catch (err) {
      setError("No se pudo crear la orden de servicio")
      console.error(err)
      throw err
    }
  }

  const getFullOrderDetail = async (id: string) => {
    try {
      setLoading(true);
      const detail = await serviceOrderService.getOrderDetail(id);
      return detail;
    } catch (err) {
      console.error("Error al obtener detalle profundo:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeServiceOrder = async (id: string) => {
    try {
      setError(null)

      await serviceOrderService.deleteServiceOrder(id)

      setServiceOrders((prev) =>
        prev.filter((order) => order.id !== id)
      )
      setTotal((prev) => Math.max(prev - 1, 0))
    } catch (err) {
      setError("No se pudo eliminar la orden de servicio")
      console.error(err)
      throw err
    }
  }

  useEffect(() => {
    fetchServiceOrders()
  }, [fetchServiceOrders])

  return {
    serviceOrders,
    loading,
    error,
    page,
    lastPage,
    total,
    setPage,
    search,
    setSearch,
    getFullOrderDetail,
    refresh: fetchServiceOrders,
    addServiceOrder,
    removeServiceOrder,
  }
}