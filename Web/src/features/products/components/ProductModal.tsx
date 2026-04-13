import type { Product } from "../types"
import { X } from "lucide-react"

interface SelectOption {
  id?: string
  name: string
  isActive?: boolean
}

interface ProductModalProps {
  isOpen: boolean
  editingProduct: Product | null
  categories: SelectOption[]
  brands: SelectOption[]
  onClose: () => void
  onSubmit: (formData: FormData) => void
}

export default function ProductModal({
  isOpen,
  editingProduct,
  categories,
  brands,
  onClose,
  onSubmit,
}: ProductModalProps) {
  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-[2.5rem] bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Cabecera Estilo Premium */}
        <div className="bg-[#2D3ABE] px-8 py-6 text-white flex justify-between items-center">
          <div>
            <h3 className="font-bold text-2xl tracking-tight">
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </h3>
            <p className="mt-1 text-sm text-blue-100">
              {editingProduct
                ? "Modifica los datos técnicos y comerciales del producto"
                : "Registra un nuevo producto en el inventario"}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nombre */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Nombre del Producto
              </label>
              <input
                name="name"
                defaultValue={editingProduct?.name ?? ""}
                required
                placeholder="Ej: Disco Duro SSD 1TB"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D3ABE]/20 focus:border-[#2D3ABE] transition-all bg-slate-50/50"
              />
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Descripción
              </label>
              <textarea
                name="description"
                defaultValue={editingProduct?.description ?? ""}
                required
                rows={3}
                placeholder="Detalles del producto..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D3ABE]/20 focus:border-[#2D3ABE] transition-all bg-slate-50/50 resize-none"
              />
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Precio
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                defaultValue={editingProduct?.price ?? ""}
                required
                placeholder="0.00"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D3ABE]/20 focus:border-[#2D3ABE] transition-all bg-slate-50/50"
              />
            </div>

            {/* Cantidad */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Stock Inicial
              </label>
              <input
                type="number"
                name="quantity"
                min="0"
                defaultValue={editingProduct?.quantity ?? ""}
                required
                placeholder="0"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D3ABE]/20 focus:border-[#2D3ABE] transition-all bg-slate-50/50"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Categoría
              </label>
              <select
                name="category"
                defaultValue={(editingProduct as any)?.category?.id ?? ""}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D3ABE]/20 focus:border-[#2D3ABE] transition-all bg-slate-50/50 cursor-pointer"
              >
                <option value="">Seleccione categoría</option>
                {categories
                  .filter((category) => category.isActive !== false)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Marca
              </label>
              <select
                name="brand"
                defaultValue={(editingProduct as any)?.brand?.id ?? ""}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D3ABE]/20 focus:border-[#2D3ABE] transition-all bg-slate-50/50 cursor-pointer"
              >
                <option value="">Seleccione marca</option>
                {brands
                  .filter((brand) => brand.isActive !== false)
                  .map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Imagen */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Imagen del Producto
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[#2D3ABE]/20 focus:border-[#2D3ABE] transition-all bg-slate-50/50 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#2D3ABE] hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* Sección de Botones Centrados */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              type="submit"
              className="min-w-[180px] rounded-xl bg-[#2D3ABE] px-8 py-3 font-semibold text-white shadow-md shadow-blue-900/20 transition-all active:scale-95 hover:bg-blue-800"
            >
              {editingProduct ? "Guardar Cambios" : "Registrar Producto"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-w-[180px] rounded-xl bg-slate-200 px-8 py-3 font-semibold text-slate-700 transition-all active:scale-95 hover:bg-slate-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}