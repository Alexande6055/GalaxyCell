// src/features/knowledge_base/components/KnowledgeBaseTopBar.tsx

import { Plus, Search } from "lucide-react"
import type { EquipmentType } from "../types"

interface KnowledgeBaseTopBarProps {
  equipmentTypeId: string
  onEquipmentTypeChange: (value: string) => void
  onNewClick: () => void
  equipmentTypes: EquipmentType[]

  // 🔥 NUEVO
  search: string
  onSearchChange: (value: string) => void
}

export default function KnowledgeBaseTopBar({
  equipmentTypeId,
  onEquipmentTypeChange,
  onNewClick,
  equipmentTypes,
  search,
  onSearchChange,
}: KnowledgeBaseTopBarProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Base de Conocimiento
          </h1>
          <p className="text-slate-500 text-sm">
            Administra soluciones, síntomas y causas por tipo de equipo.
          </p>
        </div>

        <button
          onClick={onNewClick}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all active:scale-95 shadow-md"
        >
          <Plus className="size-5" />
          <span>Nuevo Registro</span>
        </button>
      </div>

      {/* FILTROS */}
      <div className="flex flex-col sm:flex-row gap-4">
        
        {/* 🔍 BUSCADOR */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por error, síntomas o solución..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* 📦 FILTRO TIPO EQUIPO */}
        <select
          value={equipmentTypeId}
          onChange={(e) => onEquipmentTypeChange(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 font-medium cursor-pointer w-full sm:w-80"
        >
          <option value="">Todos los tipos de equipo</option>
          {equipmentTypes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}