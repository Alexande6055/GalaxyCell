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
        className="flex items-center gap-2 rounded-2xl px-6 py-3 text-white shadow-lg transition duration-300 hover:shadow-2xl hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #007BFF 0%, #00E5FF 100%)",
          boxShadow: "0 4px 20px rgba(0, 123, 255, 0.3)"
        }}>
        <Plus className="size-5" />
        <span className="font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>Nuevo Usuario</span>
      </button>
    </div>
  )
}
