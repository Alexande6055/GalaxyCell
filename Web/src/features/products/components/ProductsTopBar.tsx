import { Plus, Search } from "lucide-react"

interface SelectOption {
  id?: string
  name: string
}

interface ProductsTopBarProps {
  search: string
  statusFilter: string
  categoryFilter: string
  brandFilter: string
  categories: SelectOption[]
  brands: SelectOption[]
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onCategoryFilterChange: (value: string) => void
  onBrandFilterChange: (value: string) => void
  onNewClick: () => void
}

export default function ProductsTopBar({
  search,
  statusFilter,
  categoryFilter,
  brandFilter,
  categories,
  brands,
  onSearchChange,
  onStatusFilterChange,
  onCategoryFilterChange,
  onBrandFilterChange,
  onNewClick,
}: ProductsTopBarProps) {
  return (
    <div className="mb-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Gestión de Productos
          </h1>
          <p className="text-sm text-slate-500">
            Visualiza, edita y administra el inventario de la tienda.
          </p>
        </div>

        <button
          onClick={onNewClick}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md shadow-blue-100 transition-all active:scale-95 hover:bg-blue-700"
        >
          <Plus className="size-5" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative md:col-span-2 xl:col-span-1">
          <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-12 text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={brandFilter}
          onChange={(e) => onBrandFilterChange(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Todas las marcas</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}