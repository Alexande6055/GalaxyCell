import { useState } from 'react'
import LoginPage from './page/LoginPage'
import { Bell, CheckCircle, History, LayoutDashboard, LogOut, Menu, Moon, Search, Smartphone, Sun, Wrench } from 'lucide-react';
import { FontStyle, NOTIFICATIONS } from './utils/Data';

function App() {

  const [user, setUser] = useState<{
    user: {
      id: number;
      username: string;
      password: string;
      role: string;
      name: string;
      email: string;
      status: string;
      avatar: string;
    }
  } | null>(null);
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  const adminNav = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];
  const techNav = [
    { id: "services", label: "Mis Órdenes", icon: Wrench },
    { id: "history", label: "Historial", icon: History },
    { id: "notifications", label: "Notificaciones", icon: Bell },
  ];
  const nav = user?.user.role === "admin" ? adminNav : techNav;

  if (!user) return <LoginPage onLogin={(u) => { setUser({ user: u }); setPage(u.role === "admin" ? "dashboard" : "services"); }} />;

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <div><p>Hola Admin</p></div>;
      case "services": return <div><p>Hola Tecnico</p></div>;

      default: return null;
    }
  };

  return (
    <div className={`min-h-screen flex ${dark ? "dark-bg text-white" : "text-gray-800"}`} style={{ background: dark ? "#121212" : "#F8F9FA" }}>
      <FontStyle />
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 ${sideOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{ background: "#1A237E", boxShadow: "4px 0 20px rgba(0,0,0,0.15)" }}>
        <div className="p-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center btn-primary shrink-0"><Smartphone size={18} color="white" /></div>
          <div><p className="font-display font-bold text-white text-lg leading-tight">Galaxy Cell</p><p className="text-blue-300 text-xs">Panel Administrativo</p></div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setPage(id); setSideOpen(false); }}
              className={`sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${page === id ? "active text-cyan-300" : "text-blue-200 hover:text-white"}`}>
              <Icon size={17} />{label}
              {id === "notifications" && unreadCount > 0 && <span className="ml-auto bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{unreadCount}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white btn-primary shrink-0">{user.user.avatar}</div>
            <div><p className="text-white text-sm font-semibold leading-tight">{user.user.name}</p><p className="text-blue-300 text-xs capitalize">{user.user.role === "admin" ? "Administrador" : "Técnico"}</p></div>
          </div>
          <button onClick={() => setUser(null)} className="w-full flex items-center gap-2 text-blue-300 hover:text-white text-xs font-medium px-2 py-2 rounded-xl hover:bg-white/10 transition-all">
            <LogOut size={14} />Cerrar Sesión
          </button>
        </div>
      </aside>
      {sideOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSideOpen(false)} />}
      {/* MAIN */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* TOPBAR */}
        <header className={`sticky top-0 z-20 px-4 py-3 flex items-center gap-3 border-b ${dark ? "dark-surface border-gray-800" : "bg-white border-gray-100"}`} style={{ backdropFilter: "blur(8px)" }}>
          <button onClick={() => setSideOpen(true)} className={`lg:hidden p-2 rounded-xl ${dark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}><Menu size={18} /></button>
          <div className={`relative flex-1 max-w-xs hidden sm:block`}>
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input placeholder="Buscar IMEI, cliente, orden..." className={`w-full pl-9 pr-4 py-2 rounded-xl border text-sm ${dark ? "dark-surface2 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200"}`} />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => setDark(!dark)} className={`p-2 rounded-xl transition-colors ${dark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className={`p-2 rounded-xl transition-colors relative ${dark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}>
                <Bell size={18} />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full pulse-dot" style={{ background: "#007BFF" }} />}
              </button>
              {notifOpen && (
                <div className={`absolute right-0 top-12 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden ${dark ? "dark-surface border border-gray-700" : "bg-white border border-gray-100"}`}>
                  <div className={`p-4 border-b font-display font-semibold text-sm flex items-center justify-between ${dark ? "border-gray-700" : "border-gray-100"}`}>
                    <span>Notificaciones</span><span className="text-xs font-normal" style={{ color: "#007BFF" }}>{unreadCount} nuevas</span>
                  </div>
                  {NOTIFICATIONS.slice(0, 3).map(n => (
                    <div key={n.id} className={`p-3 border-b text-sm flex items-start gap-2.5 ${dark ? "border-gray-700/50 hover:bg-gray-700/30" : "border-gray-50 hover:bg-gray-50"} ${!n.read ? "bg-blue-50/20" : ""}`}>
                      {n.type === "ready" ? <CheckCircle size={15} className="text-emerald-500 mt-0.5 shrink-0" /> : <Bell size={15} className="text-blue-500 mt-0.5 shrink-0" />}
                      <div><p className={`leading-tight ${dark ? "text-gray-300" : "text-gray-700"}`}>{n.message}</p><p className={`text-xs mt-0.5 ${dark ? "text-gray-500" : "text-gray-400"}`}>{n.time}</p></div>
                    </div>
                  ))}
                  <button onClick={() => { setNotifOpen(false); setPage("notifications"); }} className="w-full p-3 text-xs font-semibold text-center" style={{ color: "#007BFF" }}>Ver todas</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{renderPage()}</main>
      </div>
    </div>
  );



}

export default App