import { useMemo, useState } from "react"
import { toast } from "sonner"
import CategoryModal from "../components/CategoryModal"
import CategoriesTopBar from '../components/CategoriesTopBar'
import CategoryTable from "../components/CategoryTable"
import { useCategories } from "../hooks/useCategories"
import type { Category, CategoryFormData } from "../types"

export const CategoriesPage = () => {
  const {
    categories,
    loading,
    error,
    page,
    lastPage,
    setPage,
    statusFilter,
    setStatusFilter,
    addCategory,
    updateCategory,
    toggleStatus 
  } = useCategories()

  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [categories, search])

  const handleCreate = async (formData: FormData) => {
    try {
      const data: CategoryFormData = {
        name: String(formData.get("name") ?? ""),
        description: String(formData.get("description") ?? ""),
      }
      await addCategory(data)
      toast.success("Categoría creada con éxito")
      setDialogOpen(false)
    } catch (error) {
      toast.error("Error al crear categoría")
    }
  }

  const handleUpdate = async (formData: FormData) => {
    if (!editingCategory?.id) return
    try {
      const data: Partial<CategoryFormData> = {
        name: String(formData.get("name") ?? ""),
        description: String(formData.get("description") ?? ""),
      }
      await updateCategory(editingCategory.id, data)
      toast.success("Categoría actualizada")
      setDialogOpen(false)
      setEditingCategory(null)
    } catch (error) {
      toast.error("Error al actualizar")
    }
  }

  const handleToggleStatus = async (category: Category) => {
    try {
      await toggleStatus(category)
      toast.success(`Estado actualizado`)
    } catch (error) {
      toast.error("Error al cambiar estado")
    }
  }

  if (loading && categories.length === 0) return <p className="p-8 text-center text-slate-500">Cargando...</p>

  return (
    <div className="flex flex-col gap-4 min-h-screen bg-gray-50 p-4">
      <CategoryModal
        isOpen={dialogOpen}
        editingCategory={editingCategory}
        onClose={() => { setDialogOpen(false); setEditingCategory(null); }}
        onSubmit={editingCategory ? handleUpdate : handleCreate}
      />

      <div className="flex w-full flex-col gap-8 p-1">
        <CategoriesTopBar 
          search={search} onSearchChange={setSearch} 
          statusFilter={statusFilter} onStatusChange={setStatusFilter}
          onNewClick={() => { setEditingCategory(null); setDialogOpen(true); }} 
        />

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-2xl text-sm">{error}</div>}

        <CategoryTable
          categories={filteredCategories}
          onEditClick={(cat) => { setEditingCategory(cat); setDialogOpen(true); }}
          onToggleStatus={handleToggleStatus} 
        />

        {/* Paginación */}
        <div className="flex items-center justify-between py-4 bg-white px-6 rounded-3xl border border-slate-100">
          <span className="text-sm text-slate-500 font-medium">Página {page} de {lastPage}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-slate-50 rounded-xl disabled:opacity-50 font-bold text-slate-600">Anterior</button>
            <button disabled={page >= lastPage} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-slate-50 rounded-xl disabled:opacity-50 font-bold text-slate-600">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  )
}