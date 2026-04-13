import { Edit, Eye, Package, Trash2 } from "lucide-react"
import type { Product } from "../types"

interface ProductTableProps {
  products: Product[]
  onViewClick: (product: Product) => void
  onEditClick: (product: Product) => void
  onDeleteClick: (productId: string) => void
  onToggleStatusClick: (product: Product) => void
}

export default function ProductTable({
  products,
  onViewClick,
  onEditClick,
  onDeleteClick,
}: ProductTableProps) {
  return (
    <div className="relative overflow-x-auto rounded-[2rem] bg-white shadow-xl shadow-blue-900/5 border border-slate-100">
      <table className="w-full text-sm text-left border-separate border-spacing-0">
        <thead className="bg-[#2D3ABE] text-white">
          <tr>
            <th className="px-6 py-5 font-bold uppercase tracking-wide rounded-tl-[2rem]">Nombre</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide">Categoría</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide">Marca</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide text-center">Precio</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide text-center">Stock</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide text-center">Estado</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide text-right rounded-tr-[2rem]">Acciones</th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {products.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-20 text-center text-slate-400 font-medium">
                <Package className="mx-auto mb-4 size-12 opacity-20" />
                No se encontraron productos registrados
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr
                key={product.id}
                className="group transition-all duration-200 hover:bg-blue-50/40"
              >
                <td className="px-6 py-4 border-b border-slate-50">
                  <div className="font-bold text-[#1A237E]">{product.name}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                    {product.description}
                  </div>
                </td>

                <td className="px-6 py-4 text-slate-600 border-b border-slate-50">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-[11px] font-medium text-slate-500">
                    {product.category?.name ?? "Sin categoría"}
                  </span>
                </td>

                <td className="px-6 py-4 text-slate-600 border-b border-slate-50 font-medium">
                  {product.brand?.name ?? "---"}
                </td>

                <td className="px-6 py-4 text-center border-b border-slate-50 font-bold text-[#1A237E]">
                  ${Number(product.price).toFixed(2)}
                </td>

                <td className="px-6 py-4 text-center border-b border-slate-50">
                  <span className={`font-semibold ${product.quantity < 5 ? 'text-amber-600' : 'text-slate-600'}`}>
                    {product.quantity}
                  </span>
                </td>

                <td className="px-6 py-4 text-center border-b border-slate-50">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      product.isActive
                        ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                        : "bg-rose-50 text-rose-600 ring-1 ring-rose-100"
                    }`}
                  >
                    {product.isActive ? "ACTIVO" : "INACTIVO"}
                  </span>
                </td>

                <td className="px-6 py-4 text-right border-b border-slate-50">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onViewClick(product)}
                      className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm"
                      title="Ver detalles"
                    >
                      <Eye className="size-4" />
                    </button>

                    <button
                      onClick={() => onEditClick(product)}
                      className="p-2.5 bg-blue-50 text-[#2D3ABE] rounded-xl hover:bg-[#2D3ABE] hover:text-white transition-all duration-300 shadow-sm"
                      title="Editar producto"
                    >
                      <Edit className="size-4" />
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