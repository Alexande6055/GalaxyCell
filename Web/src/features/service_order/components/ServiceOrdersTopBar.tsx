// src/service-orders/components/ServiceOrdersTopBar.tsx

import { Plus, Search } from "lucide-react";

interface ServiceOrdersTopBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onNewClick: () => void;
}

export default function ServiceOrdersTopBar({
  search,
  onSearchChange,
  onNewClick,
}: ServiceOrdersTopBarProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Gestión de Órdenes de Servicio
          </h1>
          <p className="text-slate-500 text-sm">
            Administra el ingreso y seguimiento de órdenes de servicio.
          </p>
        </div>

        <button
          onClick={onNewClick}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md shadow-blue-100 transition-all active:scale-95 hover:bg-blue-700">
          <Plus className="size-5" />
          <span>Nueva Orden</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por número de orden, nombre o cédula..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
      </div>
    </div>
  );
}