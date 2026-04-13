// App.tsx
import { useState } from 'react'
import LoginPage from './page/LoginPage'
import {
  Bell,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Smartphone,
   Users,
  User,
  Package,
  Tags,
  Layers,
  Wrench,
  BookOpen
} from 'lucide-react'
import { FontStyle } from './utils/Data'
import DashboardView from './page/Dashboard'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Services from './components/Tech/ServicesOrder'
import UsersView from './page/UsersView'
import { ProductsPage } from './features/products/pages/ProductsPage'
import { BrandsPage } from './features/brand/pages/BrandsPage'
import { CategoriesPage } from './features/category/pages/CategoriesPage'
import { ClientsPage } from './features/clients/pages/ClientsPage'
import { ServiceOrdersPage } from './features/service_order/pages/ServiceOrdersPage'
import { ServiceDetailsPage } from './features/service_detail/pages/ServiceDetailsPage'
import { KnowledgeBasePage } from './features/knowledge_base/pages/KnowledgeBasePage'

import type { ServiceOrder } from './features/service_detail/types'
import { Toaster } from 'sonner'

function AppInner() {
  const { user, logout } = useAuth()
  const [page, setPage] = useState('dashboard')
  const [sideOpen, setSideOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null)

  const adminNav = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'usuarios', label: 'Usuarios', icon: Users },              // 👥 gestión usuarios
  { id: 'clientes', label: 'Clientes', icon: User },                // 👤 cliente individual
  { id: 'productos', label: 'Productos', icon: Package },           // 📦 productos
  { id: 'marcas', label: 'Marcas', icon: Tags },                    // 🏷️ marcas
  { id: 'categoria', label: 'Categorías', icon: Layers },           // 🧱 categorías
  { id: 'order_service', label: 'Órdenes de Servicio', icon: Wrench }, // 🔧 órdenes
  { id: 'base_conocimientos', label: 'Base de conocimientos', icon: BookOpen }, // 📚 KB
]

  const techNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clientes', label: 'Clientes', icon: User },                // 👤 cliente individual
    { id: 'order_service', label: 'Órdenes de Servicio', icon: Wrench }, // 🔧 órdenes
    { id: 'base_conocimientos', label: 'Base de conocimientos', icon: BookOpen }, // 📚 KB
  ]

  const nav = user?.email === 'galaxycell@gmail.com' ? adminNav : techNav

  if (!user) {
    return (
      <LoginPage
        onLogin={() => {
          setPage('dashboard')
        }}
      />
    )
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardView user={user} />
      case 'services':
        return <Services user={user} />
      case 'usuarios':
        return <UsersView />
      case 'productos':
        return <ProductsPage />
      case 'marcas':
        return <BrandsPage />
      case 'categoria':
        return <CategoriesPage />
      case 'clientes':
        return <ClientsPage />
      case 'order_service':
        return (
          <ServiceOrdersPage
            onViewEditDetails={(order) => {
              setSelectedOrder(order)
              setPage('service_detail')
            }}
          />
        )
      case 'service_detail':
        return (
          <ServiceDetailsPage
            serviceOrder={selectedOrder}
            onBack={() => {
              setSelectedOrder(null)
              setPage('order_service')
            }}
          />
        )

        case 'base_conocimientos':
        return <KnowledgeBasePage />

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 italic">Módulo en desarrollo...</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen flex text-gray-800 bg-[#F8F9FA]">
      <Toaster richColors position="top-right" />
      <FontStyle />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 
        ${sideOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ background: '#1A237E', boxShadow: '4px 0 20px rgba(0,0,0,0.15)' }}
      >
        <div className="p-6 flex flex-col gap-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20 shrink-0">
              <Smartphone size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-xl tracking-tight leading-none">
                Galaxy Cell
              </span>
              <span className="text-blue-300/60 text-[10px] uppercase tracking-widest font-medium mt-1">
                Panel Administrativo
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="flex flex-col gap-1">
              <p className="text-white text-sm font-medium truncate opacity-90" title={user.email}>
                {user.email}
              </p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider">
                  {user.email === 'galaxycell@gmail.com' ? 'Administrador' : 'Técnico'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setPage(id)
                setSideOpen(false)
                if (id !== 'service_detail') {
                  setSelectedOrder(null)
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all 
              ${
                page === id
                  ? 'bg-white/10 text-cyan-300 shadow-inner'
                  : 'text-blue-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 mt-auto">
          <button
            onClick={() => logout()}
            className="group w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl 
                       transition-all duration-300 ease-in-out bg-transparent border border-white/10 
                       text-white/60 hover:bg-red-600 hover:border-red-600 hover:text-white hover:shadow-lg active:scale-[0.98]"
          >
            <LogOut
              size={20}
              className="opacity-60 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300"
            />
            <span className="font-semibold text-sm tracking-wide">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {sideOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSideOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 md:px-8 shadow-sm">
          <button
            onClick={() => setSideOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-lg lg:hidden text-slate-600"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 lg:flex hidden">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
              {page === 'service_detail'
                ? `Detalle de Orden ${selectedOrder?.order_number ?? ''}`
                : nav.find((n) => n.id === page)?.label || 'Galaxy Cell'}
            </h2>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{renderPage()}</main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}