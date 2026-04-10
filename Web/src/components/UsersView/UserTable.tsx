import { Edit, ShieldCheck, ShieldOff, UserCog } from "lucide-react"
import type { UserBack } from "../../utils/DataTypeBackEnd"

interface UserTableProps {
  users: UserBack[]
  onEditClick: (user: UserBack) => void
  onToggleStatus: (userId: string) => void
}

export default function UserTable({ users, onEditClick, onToggleStatus }: UserTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-white/50" style={{ background: "rgba(255, 255, 255, 0.9)", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)" }}>
      <table className="w-full text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
        <thead className="border-b border-[#E2E8F0] bg-linear-to-r from-[#F8F9FA] to-white">
          <tr>
            <th className="px-6 py-4 text-left font-semibold text-[#1A237E]">Nombre</th>
            <th className="px-6 py-4 text-left font-semibold text-[#1A237E]">Rol</th>
            <th className="px-6 py-4 text-left font-semibold text-[#1A237E]">Email</th>
            <th className="px-6 py-4 text-left font-semibold text-[#1A237E]">Estado</th>
            <th className="px-6 py-4 text-right font-semibold text-[#1A237E]">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-16 text-center">
                <UserCog className="mx-auto mb-4 size-12 text-[#CBD5E1]" />
                <p className="text-[#94a3b8] font-medium">No se encontraron usuarios</p>
              </td>
            </tr>
          ) : (
            users.map((u, index) => (
              <tr
                key={u.uidFirebase}
                className="border-t border-[#E2E8F0] hover:bg-[#F8F9FA] transition duration-200"
                style={{ backgroundColor: index % 2 === 0 ? "rgba(248, 249, 250, 0.5)" : "white" }}
              >
                <td className="px-6 py-4 font-bold text-[#0f172a]">{u.nombre}</td>
                <td className="px-6 py-4">
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
                      onClick={() => onEditClick(u)}
                      className="rounded-xl p-2.5 hover:bg-[#E2E8F0] transition duration-200"
                      title="Editar usuario"
                    >
                      <Edit className="size-5 text-[#007BFF]" />
                    </button>
                    <button
                      onClick={() => onToggleStatus(u.uidFirebase)}
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
  )
}
