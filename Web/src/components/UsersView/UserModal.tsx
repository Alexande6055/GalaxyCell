import type { UserCreate } from "../../page/UsersView"

interface UserModalProps {
  isOpen: boolean
  editingUser: UserCreate | null
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white/95 backdrop-blur-md p-8 shadow-2xl border border-white/20" style={{ background: "rgba(255, 255, 255, 0.95)" }}>
        <h3 className="mb-2 text-2xl font-bold text-[#1A237E]" style={{ fontFamily: "Montserrat, sans-serif" }}>
          {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
        </h3>
        <p className="mb-6 text-sm text-[#64748b]">
          {editingUser
            ? "Modifica los datos del usuario"
            : "Crea una nueva cuenta de usuario"}
        </p>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-[#1A237E]" style={{ fontFamily: "Inter, sans-serif" }}>
                Nombre Completo
              </label>
              <input
                name="nombre"
                defaultValue={editingUser?.nombre}
                required
                className="mt-2 w-full rounded-2xl border border-[#E2E8F0] px-4 py-3 bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-[#007BFF] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A237E]" style={{ fontFamily: "Inter, sans-serif" }}>Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder={
                  editingUser
                    ? "Opcional - dejar vacío para no cambiar"
                    : "Mínimo 6 caracteres"
                }
                className="mt-2 w-full rounded-2xl border border-[#E2E8F0] px-4 py-3 bg-[#F8F9FA] focus:ring-2 focus:ring-[#007BFF] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A237E]" style={{ fontFamily: "Inter, sans-serif" }}>Email</label>
              <input
                type="email"
                name="email"
                defaultValue={editingUser?.email}
                required
                className="mt-2 w-full rounded-2xl border border-[#E2E8F0] px-4 py-3 bg-[#F8F9FA] focus:ring-2 focus:ring-[#007BFF] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A237E]" style={{ fontFamily: "Inter, sans-serif" }}>Rol Técnico</label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-[#E2E8F0] px-6 py-2.5 text-[#1A237E] font-semibold hover:bg-[#F8F9FA] transition duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-2xl px-6 py-2.5 text-white font-semibold transition duration-200 hover:shadow-lg active:scale-95"
              style={{
                background: "linear-gradient(135deg, #007BFF 0%, #00E5FF 100%)"
              }}
            >
              {editingUser ? "Guardar Cambios" : "Registrar Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
