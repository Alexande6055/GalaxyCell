import type { UserBack } from "../../utils/DataTypeBackEnd"

interface UserModalProps {
  isOpen: boolean
  editingUser: UserBack | null
  onClose: () => void
  onSubmit: (formData: FormData) => void
}

export default function UserModal({ isOpen, editingUser, onClose, onSubmit }: UserModalProps) {
  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-[2.5rem] bg-white shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
        
        {/* HEADER INSTITUCIONAL */}
        <div className="bg-[#1A237E] px-8 py-6 text-white">
          <h3 className="text-2xl font-bold tracking-tight">
            {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
          </h3>
          <p className="text-blue-200/70 text-xs uppercase tracking-widest font-medium mt-1">
            Control de Accesos y Personal
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              
              {/* NOMBRE COMPLETO */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-[#1A237E] mb-2 ml-1">
                  Nombre Completo
                </label>
                <input
                  name="nombre"
                  defaultValue={editingUser?.nombre}
                  required
                  placeholder="Ej: Juan Pérez"
                  className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-3 bg-[#F8F9FA] focus:ring-2 focus:ring-[#1A237E] outline-none transition-all text-slate-700"
                />
              </div>

              {/* EMAIL */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-[#1A237E] mb-2 ml-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingUser?.email}
                  required
                  placeholder="correo@ejemplo.com"
                  className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-3 bg-[#F8F9FA] focus:ring-2 focus:ring-[#1A237E] outline-none transition-all text-slate-700"
                />
              </div>

              {/* CONTRASEÑA */}
              <div>
                <label className="block text-sm font-bold text-[#1A237E] mb-2 ml-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder={editingUser ? "••••••••" : "Mín. 6 caracteres"}
                  required={!editingUser}
                  className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-3 bg-[#F8F9FA] focus:ring-2 focus:ring-[#1A237E] outline-none transition-all text-slate-700"
                />
                {editingUser && (
                  <p className="text-[10px] text-slate-400 mt-1 ml-1 italic">
                    Dejar vacío para mantener actual
                  </p>
                )}
              </div>

              {/* ROL TÉCNICO */}
              <div>
                <label className="block text-sm font-bold text-[#1A237E] mb-2 ml-1">
                  Rol del Usuario
                </label>
                <select
                  name="role"
                  defaultValue={editingUser?.role || "tecnico"}
                  required
                  className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-3 bg-[#F8F9FA] focus:ring-2 focus:ring-[#1A237E] outline-none transition-all text-slate-700"
                >
                  <option value="admin">Administrador</option>
                  <option value="tecnico">Técnico</option>
                  <option value="recepcion">Recepción</option>
                </select>
              </div>
            </div>

            {/* BOTONES CENTRADOS Y EQUILIBRADOS */}
            <div className="mt-8 flex items-center justify-center gap-4 pt-2">
              <button
                type="submit"
                className="min-w-[140px] rounded-xl bg-[#1A237E] px-8 py-3 font-semibold text-white shadow-md shadow-blue-900/20 transition-all active:scale-95 hover:bg-[#121858]"
              >
                {editingUser ? "Guardar" : "Registrar"}
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
  )
}