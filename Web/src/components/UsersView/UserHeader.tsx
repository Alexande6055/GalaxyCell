import { Plus } from "lucide-react"

interface UserHeaderProps {
  userCount: number
  onNewUserClick: () => void
}

export default function UserHeader({ userCount, onNewUserClick }: UserHeaderProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-3xl font-bold text-[#1A237E]" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Panel de Usuarios
        </h2>
        <p className="text-sm text-[#64748b] mt-2">
          {userCount} usuarios del sistema
        </p>
      </div>

      <button
        onClick={onNewUserClick}
                 className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md shadow-blue-100 transition-all active:scale-95 hover:bg-blue-700">

        <Plus className="size-5" />
        <span className="font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>Nuevo Usuario</span>
      </button>
    </div>
  )
}
