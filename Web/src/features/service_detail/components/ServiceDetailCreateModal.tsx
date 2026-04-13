import type { EquipmentType } from "../types";
import { X } from "lucide-react"; // Opcional para un botón de cerrar

interface ServiceDetailCreateModalProps {
  isOpen: boolean;
  equipmentTypes: EquipmentType[];
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

export default function ServiceDetailCreateModal({
  isOpen,
  equipmentTypes,
  onClose,
  onSubmit,
}: ServiceDetailCreateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-[2.5rem] bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Cabecera Estilo Premium */}
        <div className="bg-[#2D3ABE] px-8 py-6 text-white flex justify-between items-center">
          <div>
            <h3 className="font-bold text-2xl tracking-tight">
              Nuevo Detalle de Recepción
            </h3>
            <p className="mt-1 text-sm text-blue-100">
              Registra el ingreso de un nuevo equipo al servicio
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(new FormData(e.currentTarget));
          }}
          className="p-8 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Serie */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Número de Serie
              </label>
              <input
                name="serial_number"
                type="text"
                placeholder="Ej: SN123456789"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D3ABE]/20 focus:border-[#2D3ABE] transition-all bg-slate-50/50"
              />
            </div>

            {/* Tipo de Equipo */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Tipo de Equipo
              </label>
              <select
                name="equipment_type"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D3ABE]/20 focus:border-[#2D3ABE] transition-all bg-slate-50/50 cursor-pointer"
              >
                <option value="">Seleccione tipo...</option>
                {equipmentTypes.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Marca
              </label>
              <input
                name="brand"
                type="text"
                placeholder="Ej: Samsung"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D3ABE]/20 focus:border-[#2D3ABE] transition-all bg-slate-50/50"
              />
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Modelo
              </label>
              <input
                name="model"
                type="text"
                placeholder="Ej: Galaxy S24 Ultra"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D3ABE]/20 focus:border-[#2D3ABE] transition-all bg-slate-50/50"
              />
            </div>

            {/* Falla Reportada */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Falla Reportada
              </label>
              <textarea
                name="reported_failure"
                required
                rows={3}
                placeholder="Describa el problema que presenta el equipo..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D3ABE]/20 focus:border-[#2D3ABE] transition-all bg-slate-50/50 resize-none"
              />
            </div>

            {/* Observaciones */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Observaciones Iniciales
              </label>
              <textarea
                name="observations"
                rows={2}
                placeholder="Estado estético, golpes, falta de botones, etc."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D3ABE]/20 focus:border-[#2D3ABE] transition-all bg-slate-50/50 resize-none"
              />
            </div>
          </div>

          {/* Sección de Botones Centrados */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              type="submit"
              className="min-w-[160px] rounded-xl bg-[#2D3ABE] px-8 py-3 font-semibold text-white shadow-md shadow-blue-900/20 transition-all active:scale-95 hover:bg-blue-800"
            >
              Registrar Equipo
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-w-[160px] rounded-xl bg-slate-200 px-8 py-3 font-semibold text-slate-700 transition-all active:scale-95 hover:bg-slate-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}