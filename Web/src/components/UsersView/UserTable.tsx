import { Edit, ShieldCheck, ShieldOff, UserCog } from "lucide-react"
import type { UserBack } from "../../utils/DataTypeBackEnd"

interface UserTableProps {
  users: UserBack[]
  onEditClick: (user: UserBack) => void
  onToggleStatus: (userId: string) => void
}

export default function UserTable({ users, onEditClick, onToggleStatus }: UserTableProps) {
  return (
    <div className="relative overflow-x-auto rounded-2xl bg-white shadow-lg border border-slate-100">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 border-b border-slate-100 text-[#1A237E] font-bold">
          <tr>
            <th className="px-6 py-4">Nombre</th>
            <th className="px-6 py-4">Rol</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4 text-center">Estado</th>
            <th className="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-16 text-center">
                <UserCog className="mx-auto mb-4 size-12 text-slate-300" />
                <p className="text-slate-400 font-medium">No se encontraron usuarios registrados</p>
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr 
                key={u.uidFirebase} 
                className="transition-colors hover:bg-indigo-50/30"
              >
                <td className="px-6 py-4 font-bold text-slate-700">
                  {u.nombre}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                    {u.rol}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 italic">
                  {u.email}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      u.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.isActive ? "Activo" : "Bloqueado"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    {/* BOTÓN EDITAR */}
                    <button
                      onClick={() => onEditClick(u)}
                      title="Editar Usuario"
                      className="p-2 rounded-lg transition-all text-indigo-600 hover:bg-indigo-50 active:scale-95"
                    >
                      <Edit className="size-4" />
                    </button>

                    {/* BOTÓN TOGGLE ESTADO */}
                    <button
                      onClick={() => onToggleStatus(u.uidFirebase)}
                      title={u.isActive ? "Bloquear Usuario" : "Activar Usuario"}
                      className={`p-2 rounded-lg transition-all active:scale-95 ${
                        u.isActive 
                          ? "text-red-500 hover:bg-red-50" 
                          : "text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      {u.isActive ? (
                        <ShieldOff className="size-4" />
                      ) : (
                        <ShieldCheck className="size-4" />
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