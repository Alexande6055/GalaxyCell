import { Search } from "lucide-react"

interface UserSearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function UserSearchBar({ value, onChange }: UserSearchBarProps) {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-md p-6 shadow-lg border border-white/50" style={{ background: "rgba(255, 255, 255, 0.8)", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)" }}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#64748b]" />
        <input
          placeholder="Buscar por nombre, usuario o email..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8F9FA] py-3.5 pl-14 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#007BFF] transition"
          style={{ fontFamily: "Inter, sans-serif" }}
        />
      </div>
    </div>
  )
}
