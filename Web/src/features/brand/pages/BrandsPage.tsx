import { useMemo, useState } from "react"
import { toast } from "sonner"
import BrandModal from "../components/BrandModal"
import BrandsTopBar from '../components/BrandsTopBar'
import BrandTable from "../components/BrandTable"
import { useBrands } from "../hooks/useBrands"
import type { Brand, BrandFormData } from "../types"

export const BrandsPage = () => {
  const {
    brands,
    loading,
    error,
    page,
    lastPage,
    setPage,
    statusFilter,      // Conectado al hook
    setStatusFilter,   // Conectado al hook
    addBrand,
    updateBrand,
    toggleStatus 
  } = useBrands()

  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)

  // Filtro local por nombre (el filtro de estado ya lo hace el backend mediante el hook)
  const filteredBrands = useMemo(() => {
    return brands.filter((brand) =>
      brand.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [brands, search])

  const handleCreate = async (formData: FormData) => {
    try {
      const data: BrandFormData = {
        name: String(formData.get("name") ?? ""),
        description: String(formData.get("description") ?? ""),
      }

      await addBrand(data)
      toast.success("Marca registrada con éxito")
      setDialogOpen(false)
      setEditingBrand(null)
    } catch (error) {
      console.error(error)
      toast.error("No se pudo registrar la marca")
    }
  }

  const handleUpdate = async (formData: FormData) => {
    if (!editingBrand?.id) return

    try {
      const data: Partial<BrandFormData> = {
        name: String(formData.get("name") ?? ""),
        description: String(formData.get("description") ?? ""),
      }

      await updateBrand(editingBrand.id, data)
      toast.success("Marca actualizada")
      setDialogOpen(false)
      setEditingBrand(null)
    } catch (error) {
      console.error(error)
      toast.error("No se pudo actualizar la marca")
    }
  }

  const handleToggleStatus = async (brand: Brand) => {
    try {
      await toggleStatus(brand)
      const action = brand.isActive ? "desactivada" : "activada"
      toast.success(`Marca ${action} con éxito`)
    } catch (error) {
      console.error(error)
      toast.error("Error al cambiar el estado")
    }
  }

  if (loading && brands.length === 0) {
    return <p className="p-8 text-center text-slate-500">Cargando marcas...</p>
  }

  return (
    <div className="flex flex-col gap-4 min-h-screen bg-gray-50 p-4">
      <BrandModal
        isOpen={dialogOpen}
        editingBrand={editingBrand}
        onClose={() => {
          setDialogOpen(false)
          setEditingBrand(null)
        }}
        onSubmit={(formData) => {
          if (editingBrand) {
            handleUpdate(formData)
          } else {
            handleCreate(formData)
          }
        }}
      />

      <div className="flex w-full flex-col gap-8 p-1">
        <BrandsTopBar 
          search={search} 
          onSearchChange={setSearch} 
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter} // Crucial: actualiza el filtro en el hook
          onNewClick={() => {
            setEditingBrand(null);
            setDialogOpen(true);
          }} 
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        <BrandTable
          brands={filteredBrands}
          onEditClick={(brand) => {
            setEditingBrand(brand)
            setDialogOpen(true)
          }}
          onToggleStatus={handleToggleStatus} 
        />

        {/* Paginación */}
        <div className="flex items-center justify-between gap-3 py-4 bg-white px-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Mostrando página <span className="text-slate-900">{page}</span> de {lastPage}
          </p>
          
          <div className="flex gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage(page - 1)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            <button
              disabled={page >= lastPage || loading}
              onClick={() => setPage(page + 1)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}