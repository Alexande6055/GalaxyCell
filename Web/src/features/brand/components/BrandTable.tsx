import { Edit, ShieldCheck, ShieldOff } from "lucide-react";
import type { Brand } from "../types";

interface BrandTableProps {
  brands: Brand[];
  onEditClick: (brand: Brand) => void;
  onToggleStatus: (brand: Brand) => void;
}

export default function BrandTable({ brands, onEditClick, onToggleStatus }: BrandTableProps) {
  return (
    <div className="relative overflow-x-auto rounded-[2rem] bg-white shadow-xl shadow-blue-900/5 border border-slate-100">
      <table className="w-full text-sm text-left border-separate border-spacing-0">
        <thead className="bg-[#2D3ABE] text-white">
          <tr>
            <th className="px-6 py-5 font-bold uppercase tracking-wide rounded-tl-[2rem]">Nombre</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide">Descripción</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide text-center">Estado</th>
            <th className="px-6 py-5 font-bold uppercase tracking-wide text-right rounded-tr-[2rem]">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {brands.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-20 text-center text-slate-400 font-medium">
                No se encontraron marcas
              </td>
            </tr>
          ) : (
            brands.map((brand) => (
              <tr 
                key={brand.id} 
                className={`group transition-all duration-200 ${
                  !brand.isActive ? 'bg-slate-50/50' : 'hover:bg-blue-50/40'
                }`}
              >
                <td className={`px-6 py-4 font-bold border-b border-slate-50 ${
                  !brand.isActive ? 'text-slate-400 line-through' : 'text-[#1A237E]'
                }`}>
                  {brand.name}
                </td>
                <td className={`px-6 py-4 border-b border-slate-50 ${
                  !brand.isActive ? 'text-slate-400 line-through' : 'text-slate-600'
                }`}>
                  {brand.description}
                </td>
                <td className="px-6 py-4 text-center border-b border-slate-50">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    brand.isActive 
                      ? 'bg-green-100 text-green-700 ring-1 ring-green-200' 
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {brand.isActive ? "ACTIVO" : "INACTIVO"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right border-b border-slate-50">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEditClick(brand)}
                      className="p-2.5 bg-blue-50 text-[#2D3ABE] rounded-xl hover:bg-[#2D3ABE] hover:text-white transition-all duration-300 shadow-sm"
                      title="Editar marca"
                    >
                      <Edit className="size-4" />
                    </button>
                    <button 
                      onClick={() => onToggleStatus(brand)} 
                      className={`p-2.5 rounded-xl transition-all duration-300 shadow-sm ${
                        brand.isActive 
                          ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' 
                          : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
                      }`}
                      title={brand.isActive ? "Desactivar" : "Activar"}
                    >
                      {brand.isActive ? <ShieldOff className="size-4" /> : <ShieldCheck className="size-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}