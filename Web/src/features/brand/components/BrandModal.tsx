import type { Brand } from "../types";

interface BrandModalProps {
  isOpen: boolean;
  editingBrand: Brand | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

export default function BrandModal({ isOpen, editingBrand, onClose, onSubmit }: BrandModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-[2.5rem] bg-white shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
        {/* HEADER OSCURO */}
        <div className="bg-[#1A237E] px-8 py-6 text-white">
          <h3 className="text-2xl font-bold tracking-tight">
            {editingBrand ? "Editar Marca" : "Nueva Marca"}
          </h3>
          <p className="text-blue-200/70 text-xs uppercase tracking-widest font-medium mt-1">
            Gestión de Inventario
          </p>
        </div>

        <div className="p-8">
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              onSubmit(new FormData(e.currentTarget)); 
            }} 
            className="space-y-5"
          >
            {/* CAMPO NOMBRE */}
            <div>
              <label className="block text-sm font-bold text-[#1A237E] mb-2 ml-1">
                Nombre de la Marca
              </label>
              <input
                name="name"
                type="text"
                defaultValue={editingBrand?.name ?? ""}
                required
                minLength={3}
                maxLength={50}
                placeholder="Ej: Nike, Samsung..."
                className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-3 bg-[#F8F9FA] focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all text-slate-700"
              />
            </div>

            {/* CAMPO DESCRIPCIÓN */}
            <div>
              <label className="block text-sm font-bold text-[#1A237E] mb-2 ml-1">
                Descripción
              </label>
              <textarea
                name="description"
                defaultValue={editingBrand?.description ?? ""}
                required
                minLength={10}
                maxLength={500}
                rows={4}
                placeholder="Escribe una breve descripción de la marca..."
                className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-3 bg-[#F8F9FA] focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all resize-none text-slate-700"
              />
              <p className="text-[10px] text-slate-400 mt-1 ml-1 text-right">
                Mín. 10 - Máx. 500 caracteres
              </p>
            </div>

            {/* BOTONES CENTRADOS Y EQUILIBRADOS */}
            <div className="mt-8 flex items-center justify-center gap-4 pt-2">
              <button 
                type="submit" 
                className="min-w-[140px] rounded-xl bg-[#1A237E] px-8 py-3 font-semibold text-white shadow-md shadow-blue-900/20 transition-all active:scale-95 hover:bg-[#121858]"
              >
                {editingBrand ? "Guardar" : "Registrar"}
              </button>

              <button 
                type="button" 
                onClick={onClose} 
                className="min-w-[140px] rounded-xl bg-slate-200 px-8 py-3 font-semibold text-slate-700 transition-all active:scale-95 hover:bg-slate-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}