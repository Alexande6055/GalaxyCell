import { useEffect, useMemo, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import type { ServiceDetail } from "../types"
import type { KnowledgeBase } from "../../knowledge_base/types"

type StatusType =
  | "Pendiente"
  | "En proceso"
  | "Completado"
  | "Cancelado"

interface ServiceDetailStatusModalProps {
  isOpen: boolean
  detail: ServiceDetail | null
  knowledgeBaseOptions: KnowledgeBase[]
  onClose: () => void
  onSubmit: (data: {
    status: StatusType
    technical_diagnosis: string | null
    knowledge_base_ids: string[]
  }) => void
}

const STATUS_OPTIONS: StatusType[] = [
  "Pendiente",
  "En proceso",
  "Completado",
  "Cancelado",
]

export default function ServiceDetailStatusModal({
  isOpen,
  detail,
  knowledgeBaseOptions,
  onClose,
  onSubmit,
}: ServiceDetailStatusModalProps) {
  const [status, setStatus] = useState<StatusType>("Pendiente")
  const [diagnosis, setDiagnosis] = useState("")
  const [knowledgeBaseId, setKnowledgeBaseId] = useState("")
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<KnowledgeBase[]>([])

  useEffect(() => {
    if (detail) {
      setStatus((detail.status as StatusType) ?? "Pendiente")
      setDiagnosis(detail.technical_diagnosis ?? "")
      setKnowledgeBaseId("")
      setSelectedKnowledgeBases([])
    }
  }, [detail])

  const availableKnowledgeBaseOptions = useMemo(() => {
    const selectedIds = new Set(selectedKnowledgeBases.map((item) => item.id))
    return knowledgeBaseOptions.filter((item) => !selectedIds.has(item.id))
  }, [knowledgeBaseOptions, selectedKnowledgeBases])

  if (!isOpen || !detail) return null

  const handleAddKnowledgeBase = () => {
    if (!knowledgeBaseId) return

    const selectedItem = knowledgeBaseOptions.find(
      (item) => item.id === knowledgeBaseId
    )

    if (!selectedItem) return

    setSelectedKnowledgeBases((prev) => [...prev, selectedItem])
    setKnowledgeBaseId("")
  }

  const handleRemoveKnowledgeBase = (id: string) => {
    setSelectedKnowledgeBases((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSubmit = () => {
    onSubmit({
      status,
      technical_diagnosis: diagnosis.trim() || null,
      knowledge_base_ids: selectedKnowledgeBases.map((item) => item.id),
    })
    // onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-[#2D3ABE] px-8 py-6 text-white">
          <h3 className="font-bold text-2xl tracking-tight">
            Detalles de revisión
          </h3>
          <p className="mt-1 text-sm text-blue-100">
            Equipo:{" "}
            <span className="font-semibold text-white">
  {`${detail.model ?? ''} - ${detail.serial_number ?? ''}`}
</span>
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusType)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Base de conocimiento
              </label>
              <div className="flex gap-2">
                <select
                  value={knowledgeBaseId}
                  onChange={(e) => setKnowledgeBaseId(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Seleccionar solución</option>
                  {availableKnowledgeBaseOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.error_title}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleAddKnowledgeBase}
                  className="px-4 py-3 bg-blue-50 text-[#2D3ABE] rounded-xl hover:bg-[#2D3ABE] hover:text-white transition-all duration-300"
                >
                  <Plus className="size-5" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Diagnóstico técnico
            </label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Describe el diagnóstico técnico..."
              rows={4}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#1A237E] uppercase tracking-wide mb-3">
              Soluciones agregadas
            </h4>

            <div className="relative rounded-[2rem] bg-white shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden">
  
  <div className="max-h-[300px] overflow-y-auto">
                 <table className="w-full text-sm text-left border-separate border-spacing-0">
                <thead className="bg-[#2D3ABE] text-white">
                  <tr>
                    <th className="px-6 py-5 font-bold uppercase tracking-wide rounded-tl-[2rem]">
                      Título del error
                    </th>
                    <th className="px-6 py-5 font-bold uppercase tracking-wide">
                      Solución
                    </th>
                    <th className="px-6 py-5 font-bold uppercase tracking-wide text-right rounded-tr-[2rem]">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {selectedKnowledgeBases.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-16 text-center text-slate-400 font-medium"
                      >
                        No se han agregado soluciones
                      </td>
                    </tr>
                  ) : (
                    selectedKnowledgeBases.map((item) => (
                      <tr
                        key={item.id}
                        className="group transition-all duration-200 hover:bg-blue-50/40"
                      >
                        <td className="px-6 py-4 font-bold text-[#1A237E] border-b border-slate-50">
                          {item.error_title}
                        </td>

                        <td className="px-6 py-4 text-slate-600 border-b border-slate-50">
                          {item.solution}
                        </td>

                        <td className="px-6 py-4 text-right border-b border-slate-50">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleRemoveKnowledgeBase(item.id)}
                              className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300"
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
            </div>
          </div>

          {/* Sección de Botones Centrados */}
<div className="flex items-center justify-center gap-4 pt-4">
  <button
  type="button"
  onClick={handleSubmit}
  className="min-w-[140px] rounded-xl bg-blue-800 px-8 py-3 font-semibold text-white shadow-md shadow-blue-900/20 transition-all active:scale-95 hover:bg-blue-900"
>
  Guardar
</button>

  <button
    type="button"
    onClick={onClose}
    className="min-w-[140px] rounded-xl bg-slate-200 px-8 py-3 font-semibold text-slate-700 transition-all active:scale-95 hover:bg-slate-300"
  >
    Cancelar
  </button>
</div>
        </div>
      </div>
    </div>
  )
}