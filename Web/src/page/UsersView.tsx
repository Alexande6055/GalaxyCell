import { useEffect, useState } from "react"
import { Plus, Search, Edit, UserCog, ShieldCheck, ShieldOff } from "lucide-react"
import { toast } from "sonner"
import { Auth } from "../services/Back-end/Auth"
import type { UserBack } from "../utils/DataTypeBackEnd"
interface UserCreate {
  uidFirebase: string,
  nombre: string,
  password: string,
  rol: "tecnico",
  isActive: boolean,
  email: string,
}
export default function UsersView() {
  const [users, setUsers] = useState<UserBack[]>([])
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserCreate | null>(null)

  useEffect(() => {
    const fetchUserTech = async () => {
      const user = await Auth.listUserTech();
      setUsers(user ? user : [])
    }
    fetchUserTech()
  }, [])
  const filteredUsers = users.filter(
    (u) =>
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      //u.usuario.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = (formData: FormData) => {
    const newUser: UserCreate = {
      uidFirebase: editingUser?.uidFirebase || `U${String(Date.now()).slice(-3)}`,
      nombre: formData.get("nombre") as string,
      //usuario: formData.get("usuario") as string,
      password: formData.get("password") as string,
      rol: "tecnico",
      isActive: editingUser?.isActive || false,
      email: formData.get("email") as string,
      //telefono: formData.get("telefono") as string,
    }

    if (editingUser) {
      setUsers((prev) => prev.map((u) => (u.uidFirebase === editingUser.uidFirebase ? newUser : u)))
      toast.success("Usuario actualizado")
    } else {
      setUsers((prev) => [...prev, newUser])
      toast.success("Usuario registrado")
    }

    setDialogOpen(false)
    setEditingUser(null)
  }

  const handleUpdate = async (formData: FormData) => {
    if (!editingUser) return;

    const passwordValue = formData.get("password") as string;

    const updatePayload = {
      email: formData.get("email") as string,
      nombre: formData.get("nombre") as string,
      password:
        passwordValue && passwordValue.trim() !== ""
          ? passwordValue
          : null,
    };

    const response = await Auth.updateUserTech({ ...updatePayload });

    if (!response) {
      toast.error("No se pudo actualizar el usuario");
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.uidFirebase === editingUser.uidFirebase
          ? { ...u, nombre: updatePayload.nombre, email: updatePayload.email }
          : u
      )
    );

    toast.success("Usuario actualizado");

    setDialogOpen(false);
    setEditingUser(null);
  };
  const toggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.uidFirebase === userId
          ? { ...u, estado: u.isActive ? "bloqueado" : "activo" }
          : u
      )
    )
    toast.success("Estado actualizado")
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">

      <div className="flex flex-col gap-8 p-1 w-full">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#1A237E]" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Panel de Usuarios
            </h2>
            <p className="text-sm text-[#64748b] mt-2">
              {filteredUsers.length} usuarios del sistema
            </p>
          </div>

          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 rounded-2xl px-6 py-3 text-white shadow-lg transition duration-300 hover:shadow-2xl hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #007BFF 0%, #00E5FF 100%)",
              boxShadow: "0 4px 20px rgba(0, 123, 255, 0.3)"
            }}>
            <Plus className="size-5" />
            <span className="font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>Nuevo Usuario</span>
          </button>
        </div>

        {/* Modal */}
        {dialogOpen && (
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

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);

                  if (editingUser) {
                    handleUpdate(formData);
                  } else {
                    handleCreate(formData);
                  }
                }}
                className="grid gap-5"
              >
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
                    onClick={() => {
                      setDialogOpen(false)
                      setEditingUser(null)
                    }}
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
        )}

        {/* Search */}
        <div className="rounded-2xl bg-white/80 backdrop-blur-md p-6 shadow-lg border border-white/50" style={{ background: "rgba(255, 255, 255, 0.8)", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)" }}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#64748b]" />
            <input
              placeholder="Buscar por nombre, usuario o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8F9FA] py-3.5 pl-14 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#007BFF] transition"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-white/50" style={{ background: "rgba(255, 255, 255, 0.9)", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)" }}>
          <table className="w-full text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            <thead className="border-b border-[#E2E8F0] bg-gradient-to-r from-[#F8F9FA] to-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-[#1A237E]">Nombre</th>
                {/*   <th className="px-6 py-4 text-left font-semibold text-[#1A237E]">Usuario</th>*/}
                <th className="px-6 py-4 text-left font-semibold text-[#1A237E]">Rol</th>
                <th className="px-6 py-4 text-left font-semibold text-[#1A237E]">Email</th>
                {/*                <th className="px-6 py-4 text-left font-semibold text-[#1A237E]">Teléfono</th>*/}
                <th className="px-6 py-4 text-left font-semibold text-[#1A237E]">Estado</th>
                <th className="px-6 py-4 text-right font-semibold text-[#1A237E]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <UserCog className="mx-auto mb-4 size-12 text-[#CBD5E1]" />
                    <p className="text-[#94a3b8] font-medium">No se encontraron usuarios</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, index) => (
                  <tr
                    key={u.uidFirebase}
                    className="border-t border-[#E2E8F0] hover:bg-[#F8F9FA] transition duration-200"
                    style={{ backgroundColor: index % 2 === 0 ? "rgba(248, 249, 250, 0.5)" : "white" }}
                  >
                    <td className="px-6 py-4 font-bold text-[#0f172a]">{u.nombre}</td>
                    {/*} <td className="px-6 py-4 font-mono text-xs text-[#64748b]">{u.usuario}</td>
                    {*/}<td className="px-6 py-4">
                      <span
                        className="rounded-full px-3 py-1.5 text-xs font-semibold"
                        style={{
                          background: "linear-gradient(135deg, rgba(0, 123, 255, 0.1) 0%, rgba(0, 229, 255, 0.1) 100%)",
                          color: "#007BFF",
                          border: "1px solid rgba(0, 123, 255, 0.3)"
                        }}
                      >
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#64748b]">{u.email}</td>
                    {/*  <td className="px-6 py-4 text-[#64748b]">{u.telefono}</td>*/}
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${u.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-[#FF5252]/10 text-[#FF5252]"
                          }`}
                      >
                        {u.isActive ? "Activo" : "Bloqueado"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingUser(u as UserCreate)
                            setDialogOpen(true)
                          }}
                          className="rounded-xl p-2.5 hover:bg-[#E2E8F0] transition duration-200"
                          title="Editar usuario"
                        >
                          <Edit className="size-5 text-[#007BFF]" />
                        </button>
                        <button
                          onClick={() => toggleStatus(u.uidFirebase)}
                          className="rounded-xl p-2.5 hover:bg-[#E2E8F0] transition duration-200"
                          title={u.isActive ? "Bloquear usuario" : "Activar usuario"}
                        >
                          {u.isActive ? (
                            <ShieldOff className="size-5 text-[#FF5252]" />
                          ) : (
                            <ShieldCheck className="size-5 text-emerald-600" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}