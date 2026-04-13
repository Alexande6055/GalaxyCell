import { ArrowLeft, Plus, Search } from "lucide-react"
import type { ServiceOrder } from "../../service_order/types"

interface ServiceDetailsTopBarProps {
  serviceOrder: ServiceOrder | null
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  onNewClick: () => void
  onBackClick: () => void
}

export default function ServiceDetailsTopBar({
  serviceOrder,
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onNewClick,
  onBackClick,
}: ServiceDetailsTopBarProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={onBackClick}
              className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft className="size-5" />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Orden {serviceOrder?.order_number ?? "---"}
              </h1>
              <p className="text-slate-500 text-sm">
                Cliente: {serviceOrder?.client.name ?? "---"} {serviceOrder?.client.lastName ?? ""}
              </p>
              <p className="text-slate-500 text-sm">
                Cédula: {serviceOrder?.client.document_number ?? "---"}
              </p>
            </div>
          </div>

          <button
            onClick={onNewClick}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all active:scale-95 shadow-md"
          >
            <Plus className="size-5" />
            <span>Nuevo Detalle</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por serie, marca o modelo..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 font-medium cursor-pointer"
        >
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En proceso">En proceso</option>
          <option value="Completado">Completado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>
    </div>
  )
}