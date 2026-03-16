import { FontStyle, PRODUCTS, REPAIR_ORDERS, SALES } from '../utils/Data'
import KPICards from '../components/admin/KPICards'
import { SalesChart, TopProducts } from '../components/admin/Charts'
import RecentRepairs from '../components/admin/RecentRepairs'
import LowStockAlert from '../components/admin/LowStockAlert'
import { DollarSign, Package, Wrench, TrendingUp, AlertTriangle, Smartphone } from 'lucide-react'
import type { UserBack } from '../utils/DataTypeBackEnd'

interface DashboardPageProps {
  user: UserBack
}

export default function DashboardView({ user }: DashboardPageProps) {
  const userD = { ...user, id: user.email === 'galaxycell@gmail.com' ? 'U001' : 'U002' }
  const isAdmin = user.rol === 'admin'

  const totalStock = PRODUCTS.reduce((acc, p) => acc + p.stock, 0)
  const lowStockItems = PRODUCTS.filter((p) => p.estado === 'bajo_stock' || p.estado === 'agotado')
  const todaySales = SALES.filter((s) => s.estado === 'completada')
  const totalRevenue = todaySales.reduce((acc, s) => acc + s.total, 0)

  const kpiCards = isAdmin
    ? [
      {
        title: 'Ventas Totales',
        value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        description: `${todaySales.length} ventas completadas`,
        icon: DollarSign,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
      },
      {
        title: 'Equipos en Stock',
        value: totalStock.toString(),
        description: `${PRODUCTS.length} productos registrados`,
        icon: Package,
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-100',
      },
      {
        title: 'Reparaciones Pendientes',
        value: REPAIR_ORDERS.filter((r) => r.estado !== 'entregado').length.toString(),
        description: `${REPAIR_ORDERS.length} órdenes totales`,
        icon: Wrench,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100',
      },
      {
        title: 'Stock Bajo / Agotado',
        value: lowStockItems.length.toString(),
        description: 'Requieren atención',
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
      },
    ]
    : [
      {
        title: 'Reparaciones Asignadas',
        value: REPAIR_ORDERS.filter((r) => r.tecnicoId === userD.id && r.estado !== 'entregado').length.toString(),
        description: 'Pendientes de completar',
        icon: Wrench,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
      },
      {
        title: 'Completadas',
        value: REPAIR_ORDERS.filter((r) => r.tecnicoId === userD.id && r.estado === 'entregado').length.toString(),
        description: 'Reparaciones finalizadas',
        icon: TrendingUp,
        color: 'text-accent',
        bgColor: 'bg-accent/10',
      },
      {
        title: 'En Reparación',
        value: REPAIR_ORDERS.filter((r) => r.tecnicoId === userD.id && r.estado === 'en_reparacion').length.toString(),
        description: 'En proceso actual',
        icon: Smartphone,
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
      },
    ]

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      <FontStyle />
      <div className="px-2 pt-2">
        <h1 className="text-sm font-display text-muted-foreground">{isAdmin ? 'Resumen general del negocio' : 'Resumen de tus asignaciones'}</h1>
      </div>

      <KPICards items={kpiCards as any} />

      {isAdmin && (
        <div className="grid gap-6 lg:grid-cols-3">
          <SalesChart />
          <TopProducts />
        </div>
      )}

      <RecentRepairs isAdmin={isAdmin} />

      {isAdmin && <LowStockAlert />}
    </div>
  )
}
