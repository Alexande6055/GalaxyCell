import { Edit, Eye, Trash2 } from "lucide-react"
import type { ServiceDetail } from "../types"

interface ServiceDetailTableProps {
  serviceDetails: ServiceDetail[]
  onViewFinalized: (detail: ServiceDetail) => void
  onUpdateStatusClick: (detail: ServiceDetail) => void
  onDeleteClick: (detail: ServiceDetail) => void
}

const getStatusStyles = (status: ServiceDetail["status"]) => {
  switch (status) {
    case "Completado":
      return "bg-green-100 text-green-700 ring-1 ring-green-200"
    case "En proceso":
      return "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
    case "Cancelado":
      return "bg-red-100 text-red-600 ring-1 ring-red-200"
    default:
      return "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
  }
}

export default function ServiceDetailTable({
  serviceDetails,
  onViewFinalized,
  onUpdateStatusClick,
  onDeleteClick,
}: ServiceDetailTableProps) {
  return (
    <div className="relative overflow-x-auto rounded-[2rem] bg-white shadow-xl shadow-blue-900/5 border border-slate-100">
      <table className="w-full text-sm text-left border-separate border-spacing-0">
        <thead className="bg-[#2D3ABE] text-white">
          <tr>
            <th className="px-6 py-5 font-bold uppercase tracking-wide rounded-tl-[2rem]">Equipo</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide">Serie</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide">Marca / Modelo</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide">Falla Reportada</th>
            <th className="px-6 py-5 text-center font-bold uppercase tracking-wide">Estado</th>
            <th className="px-6 py-5 text-right font-bold uppercase tracking-wide rounded-tr-[2rem]">Acciones</th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {serviceDetails.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-20 text-center text-slate-400 font-medium">
                No hay detalles registrados en esta orden
              </td>
            </tr>
          ) : (
            serviceDetails.map((detail) => (
              <tr 
                key={detail.id} 
                className="group transition-all duration-200 hover:bg-blue-50/40"
              >
                <td className="px-6 py-4 font-bold text-[#1A237E] border-b border-slate-50">
                  {detail.equipment_type?.name ?? "---"}
                </td>

                <td className="px-6 py-4 text-slate-600 border-b border-slate-50 font-medium">
                  {detail.serial_number ?? "---"}
                </td>

                <td className="px-6 py-4 text-slate-500 border-b border-slate-50">
                  {detail.brand ?? "---"} / {detail.model ?? "---"}
                </td>

                <td className="max-w-xs truncate px-6 py-4 text-slate-500 border-b border-slate-50 italic">
                  "{detail.reported_failure ?? "---"}"
                </td>

                <td className="px-6 py-4 text-center border-b border-slate-50">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold transition-all ${getStatusStyles(detail.status)}`}
                  >
                    {detail.status.toUpperCase()}
                  </span>
                </td>

                <td className="px-6 py-4 text-right border-b border-slate-50">
                  <div className="flex justify-end gap-2">
                    {detail.status === "Completado" ? (
                      <button
                        type="button"
                        onClick={() => onViewFinalized(detail)}
                        className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm"
                        title="Ver detalle finalizado"
                      >
                        <Eye className="size-4" />
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => onUpdateStatusClick(detail)}
                          className="p-2.5 bg-blue-50 text-[#2D3ABE] rounded-xl hover:bg-[#2D3ABE] hover:text-white transition-all duration-300 shadow-sm"
                          title="Actualizar estado"
                        >
                          <Edit className="size-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteClick(detail)}
                          className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
                          title="Eliminar detalle"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </>
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