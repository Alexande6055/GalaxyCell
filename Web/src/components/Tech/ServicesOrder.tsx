import { useState } from "react";
import { INITIAL_SERVICES, STATUS_CONFIG } from "../../utils/Data";
import type { UserBack } from "../../utils/DataTypeBackEnd";
import { Search, RefreshCw, X } from "lucide-react";

interface ServicePageProps {
  user: UserBack
}

// derive a service type from sample data
export type Service = (typeof INITIAL_SERVICES)[number];
// ─── SERVICES ─────────────────────────────────────────────────────────────────
const Services = ({ user }: ServicePageProps) => {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [modal, setModal] = useState<string | null>(null);
  const [selected, setSelected] = useState<Service | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const displayed = services.filter(s => {
    if (user.rol === "tecnico" && s.techId !== user.uidFirebase) return false;
    if (filterStatus !== "all" && s.status !== filterStatus) return false;
    if (search && !s.customer.toLowerCase().includes(search.toLowerCase()) && !s.id.includes(search) && !s.device.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const updateStatus = () => {
    if (!selected) return;
    setServices(p => p.map(s => s.id === selected.id ? { ...s, status: newStatus } : s));
    setModal(null);
  };

  const openUpdate = (s: Service) => { setSelected(s); setNewStatus(s.status); setModal("status"); };

  const statusOptions = ["pending", "in_diagnosis", "in_repair", "waiting_parts", "repaired", "delivered"];

  return (
    <div className="space-y-5 fade-in">
      <div><h2 className="font-display font-bold text-2xl">{user.rol === "tecnico" ? "Mis Órdenes de Servicio" : "Servicios Técnicos"}</h2>
        <p className={`text-sm text-gray-500`}>{displayed.length} órdenes activas</p></div>
      <div className={`rounded-2xl p-4 bg-white shadow-sm border border-gray-100`}>
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por ID, cliente o equipo..."
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm bg-gray-50 border-gray-200`} />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className={`px-3 py-2.5 rounded-xl border text-sm bg-gray-50 border-gray-200`}>
            <option value="all">Todos los estados</option>
            {statusOptions.map(s => <option key={s} value={s}>{STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]?.label}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className={`text-xs font-semibold uppercase tracking-wide border-b text-gray-400 border-gray-100`}>
              <th className="text-left pb-3">ID</th><th className="text-left pb-3">Cliente</th><th className="text-left pb-3">Dispositivo</th><th className="text-left pb-3">Problema</th>
              {user.rol === "admin" && <th className="text-left pb-3">Técnico</th>}
              <th className="text-left pb-3">Estado</th><th className="text-left pb-3">F. Estim.</th><th className="pb-3"></th>
            </tr></thead>
            <tbody>{displayed.map(s => (
              <tr key={s.id} className={`table-row-hover border-b border-gray-50`}>
                <td className="py-3 font-mono text-xs" style={{ color: "#007BFF" }}>{s.id}</td>
                <td className="py-3"><div className="font-semibold">{s.customer}</div><div className={`text-xs text-gray-400`}>{s.phone}</div></td>
                <td className={`py-3 text-gray-700`}>{s.device}</td>
                <td className={`py-3 max-w-32 truncate text-gray-500`}>{s.issue}</td>
                {user.rol === "admin" && <td className={`py-3 text-gray-500`}>{s.techName}</td>}
                <td className="py-3"><StatusBadge status={s.status} /></td>
                <td className={`py-3 text-xs text-gray-500`}>{s.estimatedDate}</td>
                <td className="py-3">
                  <button onClick={() => openUpdate(s)} className="btn-primary text-white px-3 py-1 rounded-lg text-xs font-semibold"><RefreshCw size={11} className="inline mr-1" />Estado</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      {modal === "status" && selected && (
        <Modal title={`Actualizar Estado — ${selected.id}`} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className={`p-3 rounded-xl text-sm bg-gray-50`}>
              <p className="font-semibold">{selected.customer}</p>
              <p className={ "text-gray-500"}>{selected.device} · {selected.issue}</p>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 text-gray-500`}>Nuevo Estado</label>
              <div className="space-y-2">
                {statusOptions.map(s => (
                  <label key={s} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${newStatus === s ? "border-blue-500 bg-blue-50/10" :  "border-gray-100"}`}>
                    <input type="radio" name="status" value={s} checked={newStatus === s} onChange={() => setNewStatus(s)} className="accent-blue-500" />
                    <StatusBadge status={s} />
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setModal(null)} className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold border-gray-200 text-gray-600`}>Cancelar</button>
              <button onClick={updateStatus} className="flex-1 py-2.5 rounded-xl btn-primary text-white text-sm font-semibold">Actualizar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
// ─── MODAL ─────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="w-full max-w-lg rounded-2xl shadow-2xl fade-in bg-white">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <h3 className="font-display font-bold text-lg">{title}</h3>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100/20 transition-colors"><X size={18} /></button>
      </div>
      <div className="p-5 max-h-[80vh] overflow-y-auto">{children}</div>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || { label: status, bg: "bg-gray-100 text-gray-600" };
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cfg.bg}`}>{cfg.label}</span>;
};

export default Services;
