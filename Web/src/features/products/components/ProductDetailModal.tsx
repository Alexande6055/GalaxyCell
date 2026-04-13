import { useEffect, useState } from "react"
import { X, Package, Tag, Layers, Calendar, DollarSign, Info } from "lucide-react"
import type { Product } from "../types"
import { productService } from "../services/productService"

interface ProductDetailModalProps {
  isOpen: boolean
  productId: string | null
  onClose: () => void
}

export default function ProductDetailModal({
  isOpen,
  productId,
  onClose,
}: ProductDetailModalProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && productId) {
      const fetchDetail = async () => {
        setLoading(true)
        try {
          const data = await productService.getProductDetail(productId)
          setProduct(data)
        } catch (error) {
          console.error("Error al cargar detalle:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchDetail()
    } else {
      setProduct(null)
    }
  }, [isOpen, productId])

  if (!isOpen) return null

  const baseUrl = "http://localhost:3000" // Ajusta según tu config

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-3xl rounded-[2.5rem] bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Cabecera */}
        <div className="bg-[#2D3ABE] px-8 py-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Info className="size-6" />
            </div>
            <div>
              <h3 className="font-bold text-2xl tracking-tight">Detalles del Producto</h3>
              <p className="text-sm text-blue-100">Información técnica y comercial</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-4">
              <div className="size-12 animate-spin rounded-full border-4 border-[#2D3ABE] border-t-transparent"></div>
              <p className="text-slate-500 font-medium">Cargando información...</p>
            </div>
          ) : product ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Columna Izquierda: Imagen */}
              <div className="flex flex-col gap-4">
                <div className="aspect-square w-full rounded-[2rem] bg-slate-100 border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center">
                  {product.coverImagePath ? (
                    <img
                      src={`${baseUrl}/${product.coverImagePath}`}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <Package className="size-16 mb-2 opacity-20" />
                      <span className="text-xs font-medium">Sin imagen disponible</span>
                    </div>
                  )}
                </div>
                
                <div className={`px-4 py-2 rounded-xl text-center font-bold text-sm ${product.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {product.isActive ? '● PRODUCTO ACTIVO' : '○ PRODUCTO INACTIVO'}
                </div>
              </div>

              {/* Columna Derecha: Información */}
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 leading-tight">{product.name}</h2>
                  <p className="text-slate-500 mt-2 text-sm leading-relaxed">{product.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-[#2D3ABE] mb-1">
                      <DollarSign className="size-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Precio Unitario</span>
                    </div>
                    <span className="text-xl font-bold text-slate-800">${Number(product.price).toFixed(2)}</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-[#2D3ABE] mb-1">
                      <Layers className="size-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Stock Disponible</span>
                    </div>
                    <span className="text-xl font-bold text-slate-800">{product.quantity} uds.</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="size-10 bg-blue-50 flex items-center justify-center rounded-lg text-[#2D3ABE]">
                      <Tag className="size-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Marca</p>
                      <p className="font-semibold text-slate-700">{product.brand?.name || 'No definida'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="size-10 bg-indigo-50 flex items-center justify-center rounded-lg text-indigo-600">
                      <Layers className="size-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categoría</p>
                      <p className="font-semibold text-slate-700">{product.category?.name || 'Sin categoría'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="size-10 bg-slate-100 flex items-center justify-center rounded-lg text-slate-500">
                      <Calendar className="size-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registrado el</p>
                      <p className="font-semibold text-slate-700">
                        {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <p className="text-center text-red-500">No se pudo cargar la información.</p>
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={onClose}

              className="min-w-[180px] rounded-xl bg-[#2D3ABE] px-8 py-3 font-semibold text-white shadow-md shadow-blue-900/20 transition-all active:scale-95 hover:bg-blue-800"
            >
              Cerrar Vista
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}