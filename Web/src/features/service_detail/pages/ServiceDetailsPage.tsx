import { useMemo, useState } from "react"
import { toast } from "sonner"
import ServiceDetailsTopBar from "../components/ServiceDetailsTopBar"
import ServiceDetailTable from "../components/ServiceDetailTable"
import ServiceDetailCreateModal from "../components/ServiceDetailCreateModal"
import ServiceDetailFinalized from "../components/ServiceDetailFinalized"
import ServiceDetailStatusModal from "../components/ServiceDetailStatusModal"
import { useServiceDetails } from "../hooks/useServiceDetails"
import { knowledgeBaseService } from "../../knowledge_base/services/knowledgeBaseService"
import type { KnowledgeBase } from "../../knowledge_base/types"
import { serviceDetailService } from "../services/serviceDetailService"
import type {
  ServiceDetail,
  ServiceDetailFormData,
  ServiceOrder,
} from "../types"

type StatusType =
  | "Pendiente"
  | "En proceso"
  | "Completado"
  | "Cancelado"

interface ServiceDetailsPageProps {
  serviceOrder: ServiceOrder | null
  onBack: () => void
}

export const ServiceDetailsPage = ({
  serviceOrder,
  onBack,
}: ServiceDetailsPageProps) => {
  const {
    serviceDetails,
    equipmentTypes,
    loading,
    error,
    page,
    lastPage,
    setPage,
    statusFilter,
    setStatusFilter,
    addServiceDetail,
    updateDetail,
    removeServiceDetail,
  } = useServiceDetails(serviceOrder?.id)

  const [search, setSearch] = useState("")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const [selectedDetail, setSelectedDetail] = useState<ServiceDetail | null>(null)
  const [viewDetail, setViewDetail] = useState<ServiceDetail | null>(null)

  const [knowledgeBaseOptions, setKnowledgeBaseOptions] = useState<KnowledgeBase[]>([])
  const [viewLoading, setViewLoading] = useState(false)

  const filteredDetails = useMemo(() => {
    const term = search.toLowerCase()

    return serviceDetails.filter((detail) => {
      return (
        (detail.serial_number ?? "").toLowerCase().includes(term) ||
        (detail.brand ?? "").toLowerCase().includes(term) ||
        (detail.model ?? "").toLowerCase().includes(term) ||
        (detail.reported_failure ?? "").toLowerCase().includes(term) ||
        (detail.equipment_type?.name ?? "").toLowerCase().includes(term)
      )
    })
  }, [serviceDetails, search])

  const handleCreate = async (formData: FormData) => {
    if (!serviceOrder?.id) return

    try {
      const data: ServiceDetailFormData = {
        serial_number: String(formData.get("serial_number") ?? ""),
        brand: String(formData.get("brand") ?? ""),
        model: String(formData.get("model") ?? ""),
        observations: String(formData.get("observations") ?? ""),
        reported_failure: String(formData.get("reported_failure") ?? ""),
        equipment_type: String(formData.get("equipment_type") ?? ""),
        serviceOrder: serviceOrder.id,
      }

      await addServiceDetail(data)
      toast.success("Detalle de servicio registrado con éxito")
      setCreateDialogOpen(false)
    } catch (error) {
      console.error(error)
      toast.error("No se pudo registrar el detalle")
    }
  }

 const handleOpenViewFinalized = async (detail: ServiceDetail) => {
  if (!serviceOrder?.id || !detail.id) return;

  try {
    setViewDialogOpen(true);
    setViewLoading(true);

    // Ajustado al orden correcto: ID del detalle primero
    const response = await serviceDetailService.getServiceDetailById(
      detail.id, 
      serviceOrder.id
    );
    setViewDetail(response);
  } catch (error) {
    console.error(error);
    toast.error("No se pudo cargar el detalle");
    setViewDialogOpen(false);
  } finally {
    setViewLoading(false);
  }
};

  const handleCloseViewFinalized = () => {
    setViewDialogOpen(false)
    setViewDetail(null)
  }

  const handleOpenStatus = async (detail: ServiceDetail) => {
    setSelectedDetail(detail)
    setStatusDialogOpen(true)

    const equipmentTypeId = detail.equipment_type?.id
    if (!equipmentTypeId) {
      setKnowledgeBaseOptions([])
      return
    }

    try {
      const response = await knowledgeBaseService.getKnowledgeBase(1, 100, equipmentTypeId)
      setKnowledgeBaseOptions(response.data ?? [])
    } catch (error) {
      console.error(error)
      toast.error("No se pudo cargar la base de conocimientos")
      setKnowledgeBaseOptions([])
    }
  }

// En ServiceDetailsPage.tsx

// ServiceDetailsPage.tsx

const handleStatusChange = async (data: {
  status: StatusType
  technical_diagnosis: string | null
  knowledge_base_ids: string[]
}) => {
  if (!selectedDetail?.id) return;

  try {
    const result = await updateDetail(selectedDetail.id, data);

    // Cerramos el modal inmediatamente para evitar doble click
    setStatusDialogOpen(false);
    setSelectedDetail(null);

    if (result?.orderAutoClosed) {
      toast.success("¡Orden completada!", {
        description: "Todos los equipos están listos. La orden se cerró automáticamente.",
        duration: 2000
      });
      
      // Navegación automática
      setTimeout(() => {
        onBack();
      }, 1000); 
    } else {
      toast.success("Estado del equipo actualizado");
    }
  } catch (error) {
    console.error(error);
    toast.error("Error al actualizar el estado");
  }
};


  const handleDelete = async (detail: ServiceDetail) => {
    if (!detail.id) return

    try {
      await removeServiceDetail(detail.id)
      toast.success("Detalle eliminado con éxito")
    } catch (error) {
      console.error(error)
      toast.error("No se pudo eliminar el detalle")
    }
  }

  if (!serviceOrder) {
    return (
      <div className="p-8">
        <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-4 text-red-600">
          No se encontró información de la orden de servicio.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex w-full flex-col gap-8 p-1">
        <ServiceDetailCreateModal
          isOpen={createDialogOpen}
          equipmentTypes={equipmentTypes}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreate}
        />

        <ServiceDetailFinalized
          isOpen={viewDialogOpen}
          detail={viewDetail}
          loading={viewLoading}
          onClose={handleCloseViewFinalized}
        />

        <ServiceDetailStatusModal
          isOpen={statusDialogOpen}
          detail={selectedDetail}
          knowledgeBaseOptions={knowledgeBaseOptions}
          onClose={() => {
            setStatusDialogOpen(false)
            setSelectedDetail(null)
            setKnowledgeBaseOptions([])
          }}
          onSubmit={handleStatusChange}
        />

        <ServiceDetailsTopBar
          serviceOrder={serviceOrder}
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          onNewClick={() => setCreateDialogOpen(true)}
          onBackClick={onBack}
        />

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {loading && serviceDetails.length === 0 ? (
          <p className="p-8 text-center text-slate-500">Cargando detalles...</p>
        ) : (
          <ServiceDetailTable
            serviceDetails={filteredDetails}
            onViewFinalized={handleOpenViewFinalized}
            onUpdateStatusClick={handleOpenStatus}
            onDeleteClick={handleDelete}
          />
        )}

        <div className="flex items-center justify-between gap-3 rounded-3xl border border-slate-100 bg-white px-6 py-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Mostrando página <span className="text-slate-900">{page}</span> de {lastPage}
          </p>

          <div className="flex gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage(page - 1)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            <button
              disabled={page >= lastPage || loading}
              onClick={() => setPage(page + 1)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}