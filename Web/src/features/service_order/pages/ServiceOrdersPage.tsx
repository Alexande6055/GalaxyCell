import { useEffect, useState } from "react"
import { toast } from "sonner"
import ServiceOrderModal from "../components/ServiceOrderModal"
import ServiceOrdersTopBar from "../components/ServiceOrdersTopBar"
import ServiceOrderTable from "../components/ServiceOrderTable"
// CORRECCIÓN: Importar desde el archivo correcto
import ServiceOrderFinalized from "../components/ServiceOrderFinalized" 

import { useServiceOrders } from "../hooks/useServiceOrders"
import { clientService } from "../../clients/services/clientService"
import type { Client } from "../../clients/types"
import type { ServiceOrder, ServiceOrderFormData } from "../../service_detail/types"

interface ServiceOrdersPageProps {
  onViewEditDetails: (order: ServiceOrder) => void
}

export const ServiceOrdersPage = ({ onViewEditDetails }: ServiceOrdersPageProps) => {
  const {
    serviceOrders,
    loading,
    error,
    page,
    lastPage,
    setPage,
    search,
    setSearch,
    addServiceOrder,
    getFullOrderDetail,
  } = useServiceOrders()

  // Estados para el Modal de Resumen Finalizado
  const [finalizedData, setFinalizedData] = useState<any>(null)
  const [isFinalizedOpen, setIsFinalizedOpen] = useState(false)
  const [isViewLoading, setIsViewLoading] = useState(false)

  // Estados para el Modal de Creación
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingServiceOrder, setEditingServiceOrder] = useState<ServiceOrder | null>(null)
  const [clients, setClients] = useState<Client[]>([])

  // Carga de clientes para el select del modal
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await clientService.getClients(1, 100)
        setClients(response.data)
      } catch (error) {
        console.error(error)
        toast.error("No se pudieron cargar los clientes")
      }
    }
    fetchClients()
  }, [])

  // Función para abrir el resumen detallado (Botón Ojo)
  const handleOpenView = async (order: ServiceOrder) => {
    if (!order.id) return
    
    setIsFinalizedOpen(true)
    setIsViewLoading(true)
    try {
      const detail = await getFullOrderDetail(order.id)
      setFinalizedData(detail)
    } catch (err) {
      toast.error("No se pudo obtener el detalle de la orden")
      setIsFinalizedOpen(false)
    } finally {
      setIsViewLoading(false)
    }
  }

  // Función para crear nueva orden
  const handleCreate = async (formData: FormData) => {
    try {
      const data: ServiceOrderFormData = {
        income_type: String(formData.get("income_type") ?? "externo") as "garantia" | "externo",
        client: String(formData.get("client") ?? ""),
      }

      await addServiceOrder(data)
      toast.success("Orden de servicio registrada con éxito")
      setDialogOpen(false)
      setEditingServiceOrder(null)
    } catch (error) {
      console.error(error)
      toast.error("No se pudo registrar la orden de servicio")
    }
  }

  if (loading && serviceOrders.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-slate-500 animate-pulse">Cargando órdenes de servicio...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 min-h-screen bg-gray-50 p-4">
      
      {/* Modal de Resumen Finalizado (Reporte) */}
      <ServiceOrderFinalized 
        isOpen={isFinalizedOpen}
        data={finalizedData}
        loading={isViewLoading}
        onClose={() => {
          setIsFinalizedOpen(false)
          setFinalizedData(null)
        }}
      />

      {/* Modal de Creación de Orden */}
      <ServiceOrderModal
        isOpen={dialogOpen}
        editingServiceOrder={editingServiceOrder}
        clients={clients}
        onClose={() => {
          setDialogOpen(false)
          setEditingServiceOrder(null)
        }}
        onSubmit={handleCreate}
      />

      <div className="flex w-full flex-col gap-8 p-1">
        <ServiceOrdersTopBar
          search={search}
          onSearchChange={setSearch}
          onNewClick={() => {
            setEditingServiceOrder(null)
            setDialogOpen(true)
          }}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        <ServiceOrderTable
          serviceOrders={serviceOrders}
          onEditClick={onViewEditDetails} // Lápiz -> Gestión de equipos
          onViewClick={handleOpenView}    // Ojo -> Resumen final
        />

        {/* Paginación */}
        <div className="flex items-center justify-between gap-3 py-4 bg-white px-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Mostrando página <span className="text-slate-900">{page}</span> de {lastPage}
          </p>

          <div className="flex gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage(page - 1)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            <button
              disabled={page >= lastPage || loading}
              onClick={() => setPage(page + 1)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}