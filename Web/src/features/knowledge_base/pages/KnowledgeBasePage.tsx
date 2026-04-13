import { useMemo, useState } from "react"
import { toast } from "sonner"
import KnowledgeBaseModal from "../components/KnowledgeBaseModal"
import KnowledgeBaseTopBar from "../components/KnowledgeBaseTopBar"
import KnowledgeBaseTable from "../components/KnowledgeBaseTable"
import { useKnowledgeBase } from "../hooks/useKnowledgeBase"
import type { KnowledgeBase, KnowledgeBaseFormData } from "../types"

export const KnowledgeBasePage = () => {
  const {
    knowledgeBase,
    equipmentTypes,
    loading,
    error,
    page,
    lastPage,
    setPage,
    equipmentTypeId,
    setEquipmentTypeId,
    addKnowledgeBase,
    updateKnowledgeBase,
    removeKnowledgeBase,
  } = useKnowledgeBase()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingKnowledge, setEditingKnowledge] = useState<KnowledgeBase | null>(null)

  // 🔥 NUEVO
  const [search, setSearch] = useState("")

  // 🔥 FILTRO LOCAL (igual que brands)
  const filteredKnowledge = useMemo(() => {
    const term = search.toLowerCase()

    return knowledgeBase.filter((item) =>
      item.error_title.toLowerCase().includes(term) ||
      item.symptoms.toLowerCase().includes(term) ||
      item.solution.toLowerCase().includes(term) ||
      item.root_cause.toLowerCase().includes(term)
    )
  }, [knowledgeBase, search])

  const handleCreate = async (formData: FormData) => {
    try {
      const data: KnowledgeBaseFormData = {
        error_title: String(formData.get("error_title") ?? ""),
        symptoms: String(formData.get("symptoms") ?? ""),
        root_cause: String(formData.get("root_cause") ?? ""),
        solution: String(formData.get("solution") ?? ""),
        keywords: String(formData.get("keywords") ?? ""),
        equipment_type: String(formData.get("equipment_type") ?? ""),
      }

      await addKnowledgeBase(data)
      toast.success("Registro creado con éxito")
      setDialogOpen(false)
      setEditingKnowledge(null)
    } catch (error) {
      console.error(error)
      toast.error("No se pudo registrar el conocimiento")
    }
  }

  const handleUpdate = async (formData: FormData) => {
    if (!editingKnowledge?.id) return

    try {
      const data: Partial<KnowledgeBaseFormData> = {
        error_title: String(formData.get("error_title") ?? ""),
        symptoms: String(formData.get("symptoms") ?? ""),
        root_cause: String(formData.get("root_cause") ?? ""),
        solution: String(formData.get("solution") ?? ""),
        keywords: String(formData.get("keywords") ?? ""),
        equipment_type: String(formData.get("equipment_type") ?? ""),
      }

      await updateKnowledgeBase(editingKnowledge.id, data)
      toast.success("Registro actualizado")
      setDialogOpen(false)
      setEditingKnowledge(null)
    } catch (error) {
      console.error(error)
      toast.error("No se pudo actualizar el conocimiento")
    }
  }

  const handleDelete = async (item: KnowledgeBase) => {
    if (!item.id) return

    try {
      await removeKnowledgeBase(item.id)
      toast.success("Registro eliminado con éxito")
    } catch (error) {
      console.error(error)
      toast.error("No se pudo eliminar el conocimiento")
    }
  }

  if (loading && knowledgeBase.length === 0) {
    return (
      <p className="p-8 text-center text-slate-500">
        Cargando base de conocimiento...
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4 min-h-screen bg-gray-50 p-4">

      <KnowledgeBaseModal
        isOpen={dialogOpen}
        editingKnowledge={editingKnowledge}
        equipmentTypes={equipmentTypes}
        onClose={() => {
          setDialogOpen(false)
          setEditingKnowledge(null)
        }}
        onSubmit={(formData) => {
          if (editingKnowledge) {
            handleUpdate(formData)
          } else {
            handleCreate(formData)
          }
        }}
      />

      <div className="flex w-full flex-col gap-8 p-1">

        <KnowledgeBaseTopBar
          search={search}                      // 🔥 NUEVO
          onSearchChange={setSearch}          // 🔥 NUEVO
          equipmentTypeId={equipmentTypeId}
          onEquipmentTypeChange={setEquipmentTypeId}
          equipmentTypes={equipmentTypes}
          onNewClick={() => {
            setEditingKnowledge(null)
            setDialogOpen(true)
          }}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        <KnowledgeBaseTable
          knowledgeList={filteredKnowledge}   // 🔥 FILTRADO
          onEditClick={(item) => {
            setEditingKnowledge(item)
            setDialogOpen(true)
          }}
          onDeleteClick={handleDelete}
        />

        <div className="flex items-center justify-between gap-3 py-4 bg-white px-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Mostrando página <span className="text-slate-900">{page}</span> de {lastPage}
          </p>

          <div className="flex gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage(page - 1)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Anterior
            </button>

            <button
              disabled={page >= lastPage || loading}
              onClick={() => setPage(page + 1)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}