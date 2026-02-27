export function FontStyle() {
    return (<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        h1,h2,h3,.font-display { font-family: 'Montserrat', sans-serif; }
        .glass { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); }
        .glass-light { backdrop-filter: blur(8px); background: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.4); }
        .btn-primary { background: linear-gradient(135deg, #007BFF 0%, #00E5FF 100%); }
        .btn-primary:hover { background: linear-gradient(135deg, #0056CC 0%, #00B8CC 100%); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,123,255,0.35); }
    .sidebar-item:hover { background: rgba(255,255,255,0.1); }
    .sidebar-item.active { background: rgba(0,229,255,0.2); border-right: 3px solid #00E5FF; }
    .card-hover { transition: transform 0.2s, box-shadow 0.2s; }
    .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.1); }
    .dark-bg { background-color: #121212; }
    .dark-surface { background-color: #1E1E1E; }
    .dark-surface2 { background-color: #2A2A2A; }
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #007BFF55; border-radius: 10px; }
    .table-row-hover:hover { background-color: rgba(0,123,255,0.04); }
    input:focus, select:focus, textarea:focus { outline: none; border-color: #007BFF; box-shadow: 0 0 0 3px rgba(0,123,255,0.15); }
    @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    .fade-in { animation: fadeIn 0.3s ease forwards; }
    @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .pulse-dot { animation: pulse-dot 2s infinite; }
    `}</style>)
}

export const USERS_DB = [
    { id: 1, username: "admin", password: "admin123", role: "admin", name: "Carlos Mendoza", email: "carlos@galaxycell.com", status: "active", avatar: "CM" },
    { id: 2, username: "tecnico1", password: "tech123", role: "technician", name: "Luis Herrera", email: "luis@galaxycell.com", status: "active", avatar: "LH" },
    { id: 3, username: "tecnico2", password: "tech456", role: "technician", name: "Ana Ríos", email: "ana@galaxycell.com", status: "active", avatar: "AR" },
];
export const NOTIFICATIONS = [
  { id: 1, type: "ready", message: "Equipo de Elena Castro (SRV-001) listo para retirar", time: "Hace 10 min", read: false, serviceId: "SRV-001" },
  { id: 2, type: "assigned", message: "Nueva orden SRV-006 asignada a ti", time: "Hace 30 min", read: false, serviceId: "SRV-006" },
  { id: 3, type: "parts", message: "Repuesto para SRV-004 en camino", time: "Hace 2 hrs", read: true, serviceId: "SRV-004" },
  { id: 4, type: "reminder", message: "SRV-002 vence mañana 28/02", time: "Hace 3 hrs", read: true, serviceId: "SRV-002" },
];
