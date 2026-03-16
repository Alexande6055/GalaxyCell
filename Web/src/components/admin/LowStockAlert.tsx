import type { FunctionComponent } from 'react'
import { PRODUCTS } from '../../utils/Data'
import { AlertTriangle } from 'lucide-react'

const LowStockAlert: FunctionComponent = () => {
    const lowStockItems = PRODUCTS.filter((p) => p.estado === 'bajo_stock' || p.estado === 'agotado')
    if (lowStockItems.length === 0) return null

    return (
        <div className="rounded-2xl bg-white shadow-sm border border-red-100 transition hover:shadow-md lg:col-span-2">
            <div className="px-6 pt-6 pb-4">
                <div className="flex flex-col space-y-1.5 p-0">
                    <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2 text-base text-red-500">
                        <AlertTriangle className="size-4" />
                        Alertas de Stock
                    </h3>
                    <p className="text-sm text-muted-foreground">Productos que requieren reabastecimiento</p>
                </div>
            </div>
            <div className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {lowStockItems.map((product) => (
                        <div key={product.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 hover:border-red-200 transition">
                            <div className="min-w-0">
                                <p className="text-sm font-medium leading-none mb-1 text-slate-900">{product.nombre}</p>
                                <p className="text-xs text-muted-foreground">{product.marca} {product.modelo}</p>
                            </div>
                            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white whitespace-nowrap transition-colors" style={{ backgroundColor: product.estado === 'agotado' ? '#EF4444' : '#1A237E' }}>
                                {product.estado === 'agotado' ? 'Agotado' : `Stock: ${product.stock}`}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LowStockAlert
