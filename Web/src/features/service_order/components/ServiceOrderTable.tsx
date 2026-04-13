import { Edit, Eye } from "lucide-react"
import type { ServiceOrder } from "../types"

interface ServiceOrderTableProps {
  serviceOrders: ServiceOrder[]
  onEditClick: (serviceOrder: ServiceOrder) => void
  onViewClick?: (serviceOrder: ServiceOrder) => void
}

export default function ServiceOrderTable({
  serviceOrders,
  onEditClick,
  onViewClick,
}: ServiceOrderTableProps) {
  return (
    <div className="relative overflow-x-auto rounded-[2rem] bg-white shadow-xl shadow-blue-900/5 border border-slate-100">
      <table className="w-full text-sm text-left border-separate border-spacing-0">
        <thead className="bg-[#2D3ABE] text-white">
          <tr>
            <th className="px-6 py-5 font-bold uppercase tracking-wide rounded-tl-[2rem]">Orden</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide">Cliente</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide">Documento</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide text-center">Tipo</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide text-center">Equipos</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide text-center">Estado</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide text-right rounded-tr-[2rem]">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {serviceOrders.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-20 text-center text-slate-400 font-medium">
                No se encontraron órdenes de servicio
              </td>
            </tr>
          ) : (
            serviceOrders.map((order) => (
              <tr 
                key={order.id} 
                className="group transition-all duration-200 hover:bg-blue-50/40"
              >
                <td className="px-6 py-4 font-bold text-[#1A237E] border-b border-slate-50">
                  #{order.order_number}
                </td>
                <td className="px-6 py-4 text-slate-700 border-b border-slate-50 font-medium">
                  {order.client.name} {order.client.lastName}
                </td>
                <td className="px-6 py-4 text-slate-500 border-b border-slate-50 text-xs">
                  {order.client.document_number}
                </td>
                <td className="px-6 py-4 text-center border-b border-slate-50">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-500 uppercase tracking-tighter">
                    {order.income_type}
                  </span>
                </td>
                <td className="px-6 py-4 text-center border-b border-slate-50">
                  <span className="inline-flex items-center justify-center size-6 rounded-full bg-blue-50 text-[#2D3ABE] text-xs font-bold">
                    {order.detailsCount ?? 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-center border-b border-slate-50">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                      order.status === "completada"
                        ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                        : "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
                    }`}
                  >
                    {order.status === "completada" ? "COMPLETADA" : "PENDIENTE"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right border-b border-slate-50">
                  <div className="flex justify-end gap-2">
                    {order.status !== "completada" ? (
                      <button
                        onClick={() => onEditClick(order)}
                        title="Gestionar Orden"
                        className="p-2.5 bg-blue-50 text-[#2D3ABE] rounded-xl hover:bg-[#2D3ABE] hover:text-white transition-all duration-300 shadow-sm active:scale-95"
                      >
                        <Edit className="size-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onViewClick?.(order)}
                         className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm"
                      title="Ver detalles"
                    >
                        <Eye className="size-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}