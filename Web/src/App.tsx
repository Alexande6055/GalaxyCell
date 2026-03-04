import { useState } from 'react'
import LoginPage from './page/LoginPage'
import { Bell, ChevronDown, History, LayoutDashboard, LogOut, Menu, Search, Smartphone, UserCog, Wrench } from 'lucide-react'
import { FontStyle, NOTIFICATIONS } from './utils/Data'
import DashboardView from './page/Dashboard'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Services from './components/Tech/ServicesOrder'
import UsersView from './page/UsersView'
import { Toaster } from 'sonner'

function AppInner() {
  const { user, logout } = useAuth()
  const [page, setPage] = useState('dashboard')
  const [sideOpen, setSideOpen] = useState(false)
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length
  const [searchQuery, setSearchQuery] = useState('')
  const [profileOpen, setProfileOpen] = useState(false) // Estado para el dropdown manual

  const adminNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: "usuarios", label: "Usuarios", icon: UserCog, adminOnly: true },

  ]
  const techNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'services', label: 'Mis Órdenes', icon: Wrench },
    { id: 'history', label: 'Historial', icon: History },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
  ]
  const nav = user?.email === 'galaxycell@gmail.com' ? adminNav : techNav

  if (!user) return <LoginPage onLogin={(u) => { setPage(u.rol === 'admin' ? 'dashboard' : 'dashboard') }} />

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardView user={user} />
      case 'services':
        return <Services user={user} />
      case 'usuarios':
        return <UsersView />
      default:
        return null
    }
  }

  const getModuleTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Panel de Control',
      services: 'Órdenes de Servicio',
      history: 'Historial de Reparaciones',
      notifications: 'Centro de Notificaciones',
    }
    return titles[page] || 'Galaxy Cell'
  }

  const getInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className={`min-h-screen flex text-gray-800`} style={{ background: '#F8F9FA' }}>
      <Toaster richColors position="top-right" />
      <FontStyle />
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 ${sideOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`} style={{ background: '#1A237E', boxShadow: '4px 0 20px rgba(0,0,0,0.15)' }}>
        <div className="p-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center btn-primary shrink-0"><Smartphone size={18} color="white" /></div>
          <div><p className="font-display font-bold text-white text-lg leading-tight">Galaxy Cell</p><p className="text-blue-300 text-xs">Panel Administrativo</p></div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setPage(id); setSideOpen(false) }} className={`sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${page === id ? 'active text-cyan-300' : 'text-blue-200 hover:text-white'}`}>
              <Icon size={17} />{label}
              {id === 'notifications' && unreadCount > 0 && <span className="ml-auto bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{unreadCount}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0">
              <img
                src="/assets/user.jpg"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div><p className="text-white text-sm font-semibold leading-tight">{user.email}</p><p className="text-blue-300 text-xs capitalize">{user.email === 'galaxycell@gmail.com' ? 'Administrador' : 'Técnico'}</p></div>
          </div>
          <button onClick={() => { logout() }} className="w-full flex items-center gap-2 text-blue-300 hover:text-white text-xs font-medium px-2 py-2 rounded-xl hover:bg-white/10 transition-all">
            <LogOut size={14} />Cerrar Sesión
          </button>
        </div>
      </aside>
      {sideOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSideOpen(false)} />}
      {/* MAIN */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-white px-4 md:px-8 shadow-sm">

          <div className="flex items-center gap-4 flex-1">
            {/* Botón menú móvil */}
            <button onClick={() => setSideOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg lg:hidden text-slate-600">
              <Menu size={20} />
            </button>

            <h1 className="hidden sm:block font-bold text-slate-800 text-lg whitespace-nowrap">{getModuleTitle()}</h1>

            {/* Buscador con HTML puro */}
            <div className="relative max-w-md w-full ml-4 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input type="text" placeholder="Buscar por IMEI, modelo o cliente..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 pl-10 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dropdown de Usuario Manual */}
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className={`flex items-center gap-2 p-1.5 rounded-xl transition-colors ${profileOpen ? 'bg-slate-100' : 'hover:bg-slate-50'}`}>
                {/* Avatar manual */}
                <div className="size-8 rounded-lg bg-[#1A237E] flex items-center justify-center text-white text-xs font-bold shrink-0">{getInitials(user.nombre)}</div>

                <div className="hidden md:block text-left mr-1">
                  <p className="text-xs font-bold text-slate-900 leading-none mb-0.5">{user.nombre}</p>
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">{user.rol}</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Menú desplegable HTML */}
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 overflow-hidden py-1 animate-in fade-in zoom-in duration-150">
                    <div className="px-4 py-3 border-b border-slate-50">
                      <p className="text-sm font-bold text-slate-900">{user.nombre}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button onClick={() => { logout() }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-2">{renderPage()}</main>
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