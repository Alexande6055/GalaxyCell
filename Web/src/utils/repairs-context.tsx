import { createContext, useContext, useState, type ReactNode } from "react"
import { REPAIR_ORDERS, type RepairOrder } from "./Data"

interface RepairsContextValue {
  repairs: RepairOrder[]
  acceptRequest: (repairId: string, tecnicoId: string, tecnicoNombre: string) => void
  updateStatus: (repairId: string, newStatus: RepairOrder["estado"]) => void
  updateDiagnostic: (repairId: string, diagnostico: string, notas: string) => void
}

const RepairsContext = createContext<RepairsContextValue | null>(null)

// Solicitudes entrantes sin técnico asignado (estado "recibido", sin tecnicoId real)
const INITIAL_REQUESTS: RepairOrder[] = [
  {
    id: "R006",
    clienteId: "C001",
    clienteNombre: "José Hernández",
    equipo: "Celular",
    marca: "Samsung",
    modelo: "Galaxy A54",
    imei: "354789102345699",
    problema: "No enciende después de mojarse",
    diagnostico: "",
    estado: "recibido",
    tecnicoId: "",
    tecnicoNombre: "Sin asignar",
    costo_estimado: 50,
    fecha_ingreso: "2025-03-01",
    fecha_estimada: "2025-03-05",
    notas: "Ingresó por mostrador",
  },
  {
    id: "R007",
    clienteId: "C003",
    clienteNombre: "Pedro Sánchez",
    equipo: "Celular",
    marca: "Apple",
    modelo: "iPhone 13",
    problema: "Botón de inicio no responde",
    diagnostico: "",
    estado: "recibido",
    tecnicoId: "",
    tecnicoNombre: "Sin asignar",
    costo_estimado: 35,
    fecha_ingreso: "2025-03-02",
    fecha_estimada: "2025-03-06",
    notas: "",
  },
  {
    id: "R008",
    clienteId: "C005",
    clienteNombre: "Miguel Torres",
    equipo: "Celular",
    marca: "Xiaomi",
    modelo: "Redmi 12",
    problema: "Pantalla con líneas verticales",
    diagnostico: "",
    estado: "recibido",
    tecnicoId: "",
    tecnicoNombre: "Sin asignar",
    costo_estimado: 80,
    fecha_ingreso: "2025-03-03",
    fecha_estimada: "2025-03-07",
    notas: "Caída previa reportada por cliente",
  },
]

export function RepairsProvider({ children }: { children: ReactNode }) {
  const [repairs, setRepairs] = useState<RepairOrder[]>([
    ...REPAIR_ORDERS,
    ...INITIAL_REQUESTS,
  ])

  const acceptRequest = (repairId: string, tecnicoId: string, tecnicoNombre: string) => {
    setRepairs((prev) =>
      prev.map((r) =>
        r.id === repairId
          ? { ...r, estado: "en_reparacion", tecnicoId, tecnicoNombre }
          : r
      )
    )
  }

  const updateStatus = (repairId: string, newStatus: RepairOrder["estado"]) => {
    setRepairs((prev) =>
      prev.map((r) =>
        r.id === repairId
          ? {
              ...r,
              estado: newStatus,
              ...(newStatus === "entregado"
                ? { fecha_entrega: new Date().toISOString().split("T")[0] }
                : {}),
            }
          : r
      )
    )
  }

  const updateDiagnostic = (repairId: string, diagnostico: string, notas: string) => {
    setRepairs((prev) =>
      prev.map((r) => (r.id === repairId ? { ...r, diagnostico, notas } : r))
    )
  }

  return (
    <RepairsContext.Provider value={{ repairs, acceptRequest, updateStatus, updateDiagnostic }}>
      {children}
    </RepairsContext.Provider>
  )
}

export function useRepairs() {
  const ctx = useContext(RepairsContext)
  if (!ctx) throw new Error("useRepairs must be used inside RepairsProvider")
  return ctx
}
