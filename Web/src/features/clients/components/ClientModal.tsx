import type { Client } from "../types";
import { X } from "lucide-react";

interface ClientModalProps {
  isOpen: boolean;
  editingClient: Client | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

export default function ClientModal({
  isOpen,
  editingClient,
  onClose,
  onSubmit,
}: ClientModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-[2.5rem] bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Cabecera Estilo Premium */}
        <div className="bg-[#2D3ABE] px-8 py-6 text-white flex justify-between items-center">
          <div>
            <h3 className="font-bold text-2xl tracking-tight">
              {editingClient ? "Editar Cliente" : "Nuevo Cliente"}
            </h3>
            <p className="mt-1 text-sm text-blue-100">
              {editingClient 
                ? "Actualiza la información del cliente registrado" 
                : "Completa los datos para registrar un nuevo cliente"}
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
            {/* Nombres */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Nombres
              </label>
              <input
                name="first_name"
                type="text"
                defaultValue={editingClient?.name ?? ""}
                required
                placeholder="Ej: Juan"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D3ABE]/20 focus:border-[#2D3ABE] transition-all bg-slate-50/50"
              />
            </div>

            {/* Apellidos */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Apellidos
              </label>
              <input
                name="last_name"
                type="text"
                defaultValue={editingClient?.lastName ?? ""}
                required
                placeholder="Ej: Pérez"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D3ABE]/20 focus:border-[#2D3ABE] transition-all bg-slate-50/50"
              />
            </div>

            {/* Documento */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Documento
              </label>
              <input
                name="document_number"
                type="text"
                defaultValue={editingClient?.document_number ?? ""}
                required
                placeholder="Ej: 1234567890"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D3ABE]/20 focus:border-[#2D3ABE] transition-all bg-slate-50/50"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Teléfono
              </label>
              <input
                name="phone"
                type="text"
                defaultValue={editingClient?.phone ?? ""}
                required
                placeholder="Ej: 0999999999"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D3ABE]/20 focus:border-[#2D3ABE] transition-all bg-slate-50/50"
              />
            </div>

            {/* Correo Electrónico */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Correo Electrónico
              </label>
              <input
                name="email"
                type="email"
                defaultValue={editingClient?.email ?? ""}
                required
                placeholder="Ej: cliente@email.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D3ABE]/20 focus:border-[#2D3ABE] transition-all bg-slate-50/50"
              />
            </div>
          </div>

          {/* Sección de Botones Centrados y Estilizados */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              type="submit"
              className="min-w-[180px] rounded-xl bg-[#2D3ABE] px-8 py-3 font-semibold text-white shadow-md shadow-blue-900/20 transition-all active:scale-95 hover:bg-blue-800"
            >
              {editingClient ? "Guardar Cambios" : "Registrar Cliente"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-w-[180px] rounded-xl bg-slate-200 px-8 py-3 font-semibold text-slate-700 transition-all active:scale-95 hover:bg-slate-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}