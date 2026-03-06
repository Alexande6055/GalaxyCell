import { useState } from "react"
import { Inbox, Smartphone, User, Calendar, DollarSign, StickyNote, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "../../contexts/AuthContext"
import { useRepairs } from "../../utils/repairs-context"
import type { RepairOrder } from "../../utils/Data"

export function SolicitudesView() {
  const { user } = useAuth()
  const { repairs, acceptRequest } = useRepairs()
  const [selected, setSelected] = useState<RepairOrder | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Only show unassigned "recibido" orders (no technician yet)
  const pendingRequests = repairs.filter(
    (r) => r.estado === "recibido" && r.tecnicoId === ""
  )

  const handleAccept = () => {
    if (!selected || !user) return
    acceptRequest(selected.id, user.uidFirebase, user.nombre)
    toast.success(`Reparación ${selected.id} aceptada. Ya aparece en tu lista de reparaciones.`)
    setConfirmOpen(false)
    setSelected(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">Solicitudes de Reparacion</h2>
        <p className="text-sm text-gray-500">
          {pendingRequests.length === 0
            ? "No hay solicitudes pendientes en este momento."
            : `${pendingRequests.length} solicitud${pendingRequests.length > 1 ? "es" : ""} esperando ser tomada${pendingRequests.length > 1 ? "s" : ""}`}
        </p>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <CheckCircle2 className="mb-3 size-12 text-emerald-400/60" />
          <p className="font-medium text-gray-500">Todo al dia</p>
          <p className="mt-1 text-sm text-gray-500">No hay solicitudes pendientes de asignacion.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pendingRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onAccept={() => {
                setSelected(request)
                setConfirmOpen(true)
              }}
            />
          ))}
        </div>
      )}

      {/* Confirm dialog (manual modal) */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Tomar solicitud</h3>
            <p className="mt-1 text-sm text-gray-500">
              Al aceptar, esta reparacion quedara asignada a ti y el estado cambiara a{" "}
              <span className="font-medium text-blue-600">En Reparacion</span>.
            </p>

            {selected && (
              <div className="mt-4 rounded-lg bg-gray-100 px-4 py-3 text-sm">
                <p className="font-medium">{selected.marca} {selected.modelo}</p>
                <p className="text-gray-500">{selected.clienteNombre}</p>
                <p className="mt-1 text-gray-500">{selected.problema}</p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Aceptar reparacion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function RequestCard({
  request,
  onAccept,
}: {
  request: RepairOrder
  onAccept: () => void
}) {
  return (
    <div className="flex flex-col gap-0 border border-gray-200 rounded-lg bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition hover:shadow-md">
      <div className="flex flex-col gap-4 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <Smartphone className="size-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">
                {request.marca} {request.modelo}
              </p>
              <p className="font-mono text-[10px] text-gray-500">{request.id}</p>
            </div>
          </div>
          <span className="shrink-0 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700">
            Pendiente
          </span>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <User className="size-3.5 shrink-0" />
            <span className="truncate">{request.clienteNombre}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="size-3.5 shrink-0" />
            <span>Ingreso: {request.fecha_ingreso}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <DollarSign className="size-3.5 shrink-0" />
            <span>Costo est.: ${request.costo_estimado.toFixed(2)}</span>
          </div>
        </div>

        {/* Problem */}
        <div className="rounded-md bg-gray-100 px-3 py-2">
          <div className="flex items-start gap-2">
            <StickyNote className="mt-0.5 size-3.5 shrink-0 text-gray-500" />
            <p className="text-xs leading-relaxed text-gray-500">{request.problema}</p>
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          className="mt-auto w-full inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
          onClick={onAccept}
        >
          <Inbox className="mr-1.5 size-3.5" />
          Tomar reparacion
        </button>
      </div>
    </div>
  )
}