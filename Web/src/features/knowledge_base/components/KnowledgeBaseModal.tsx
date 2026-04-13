// src/features/knowledge_base/components/KnowledgeBaseModal.tsx

import type { EquipmentType, KnowledgeBase } from "../types"

interface KnowledgeBaseModalProps {
  isOpen: boolean
  editingKnowledge: KnowledgeBase | null
  onClose: () => void
  onSubmit: (formData: FormData) => void
  equipmentTypes: EquipmentType[]
}

export default function KnowledgeBaseModal({
  isOpen,
  editingKnowledge,
  onClose,
  onSubmit,
  equipmentTypes,
}: KnowledgeBaseModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-[2.5rem] bg-white shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto overflow-x-hidden">
        
        {/* HEADER INSTITUCIONAL */}
        <div className="bg-[#1A237E] px-8 py-6 text-white">
          <h3 className="text-2xl font-bold tracking-tight">
            {editingKnowledge ? "Editar Conocimiento" : "Nuevo Conocimiento"}
          </h3>
          <p className="text-blue-200/70 text-xs uppercase tracking-widest font-medium mt-1">
            Biblioteca Técnica de Soluciones
          </p>
        </div>

        <div className="p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit(new FormData(e.currentTarget))
            }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-[#1A237E] mb-2 ml-1">
                  Título del Error
                </label>
                <input
                  name="error_title"
                  type="text"
                  defaultValue={editingKnowledge?.error_title ?? ""}
                  required
                  minLength={3}
                  maxLength={120}
                  placeholder="Ej: No enciende"
                  className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-3 bg-[#F8F9FA] focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all text-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1A237E] mb-2 ml-1">
                  Tipo de Equipo
                </label>
                <select
                  name="equipment_type"
                  defaultValue={editingKnowledge?.equipment_type?.id ?? ""}
                  required
                  className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-3 bg-[#F8F9FA] focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all text-slate-700"
                >
                  <option value="">Selecciona un tipo</option>
                  {equipmentTypes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-[#1A237E] mb-2 ml-1">
                  Síntomas
                </label>
                <textarea
                  name="symptoms"
                  defaultValue={editingKnowledge?.symptoms ?? ""}
                  required
                  minLength={5}
                  maxLength={500}
                  rows={3}
                  placeholder="Describe los síntomas observados..."
                  className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-3 bg-[#F8F9FA] focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all resize-none text-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1A237E] mb-2 ml-1">
                  Causa Raíz
                </label>
                <textarea
                  name="root_cause"
                  defaultValue={editingKnowledge?.root_cause ?? ""}
                  required
                  minLength={5}
                  maxLength={500}
                  rows={3}
                  placeholder="Indica la causa principal del problema..."
                  className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-3 bg-[#F8F9FA] focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all resize-none text-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A237E] mb-2 ml-1">
                Solución
              </label>
              <textarea
                name="solution"
                defaultValue={editingKnowledge?.solution ?? ""}
                required
                minLength={5}
                maxLength={500}
                rows={4}
                placeholder="Escribe la solución aplicada o recomendada..."
                className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-3 bg-[#F8F9FA] focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all resize-none text-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A237E] mb-2 ml-1">
                Palabras clave
              </label>
              <input
                name="keywords"
                type="text"
                defaultValue={editingKnowledge?.keywords ?? ""}
                required
                maxLength={300}
                placeholder="Ej: celular,batería,no enciende,carga"
                className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-3 bg-[#F8F9FA] focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all text-slate-700"
              />
              <p className="text-[10px] text-slate-400 mt-1 ml-1 text-right">
                Separa las palabras clave con comas
              </p>
            </div>

            {/* BOTONES CENTRADOS Y EQUILIBRADOS */}
            <div className="mt-8 flex items-center justify-center gap-4 pt-2">
              <button
                type="submit"
                className="min-w-[160px] rounded-xl bg-[#1A237E] px-8 py-3 font-semibold text-white shadow-md shadow-blue-900/20 transition-all active:scale-95 hover:bg-[#121858]"
              >
                {editingKnowledge ? "Guardar" : "Registrar"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="min-w-[160px] rounded-xl bg-slate-200 px-8 py-3 font-semibold text-slate-700 transition-all active:scale-95 hover:bg-slate-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}