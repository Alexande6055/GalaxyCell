import { Edit, Trash2 } from "lucide-react"
import type { KnowledgeBase } from "../types"

interface KnowledgeBaseTableProps {
  knowledgeList: KnowledgeBase[]
  onEditClick: (item: KnowledgeBase) => void
  onDeleteClick: (item: KnowledgeBase) => void
}

export default function KnowledgeBaseTable({
  knowledgeList,
  onEditClick,
  onDeleteClick,
}: KnowledgeBaseTableProps) {
  return (
    <div className="relative overflow-x-auto rounded-[2rem] bg-white shadow-xl shadow-blue-900/5 border border-slate-100">
      <table className="w-full text-sm text-left border-separate border-spacing-0">
        <thead className="bg-[#2D3ABE] text-white">
          <tr>
            <th className="px-6 py-5 font-bold uppercase tracking-wide rounded-tl-[2rem]">Error</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide">Síntomas</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide">Causa Raíz</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide">Solución</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide text-center">Equipo</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide text-right rounded-tr-[2rem]">Acciones</th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {knowledgeList.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-20 text-center text-slate-400 font-medium">
                No se encontraron registros en la base de conocimientos
              </td>
            </tr>
          ) : (
            knowledgeList.map((item) => (
              <tr
                key={item.id}
                className="group transition-all duration-200 hover:bg-blue-50/40"
              >
                <td className="px-6 py-4 font-bold text-[#1A237E] border-b border-slate-50">
                  {item.error_title}
                </td>

                <td className="px-6 py-4 text-slate-600 max-w-xs border-b border-slate-50">
                  <p className="line-clamp-2 text-xs leading-relaxed">{item.symptoms}</p>
                </td>

                <td className="px-6 py-4 text-slate-600 max-w-xs border-b border-slate-50">
                  <p className="line-clamp-2 text-xs leading-relaxed">{item.root_cause}</p>
                </td>

                <td className="px-6 py-4 text-slate-600 max-w-xs border-b border-slate-50">
                  <p className="line-clamp-2 text-xs leading-relaxed">{item.solution}</p>
                </td>

                <td className="px-6 py-4 text-center border-b border-slate-50">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 uppercase">
                    {item.equipment_type?.name}
                  </span>
                </td>

                <td className="px-6 py-4 text-right border-b border-slate-50">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEditClick(item)}
                      className="p-2.5 bg-blue-50 text-[#2D3ABE] rounded-xl hover:bg-[#2D3ABE] hover:text-white transition-all duration-300 shadow-sm"
                      title="Editar registro"
                    >
                      <Edit className="size-4" />
                    </button>

                    <button
                      onClick={() => onDeleteClick(item)}
                      className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
                      title="Eliminar registro"
                    >
                      <Trash2 className="size-4" />
                    </button>
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