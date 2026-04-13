import { useEffect, useMemo, useState } from "react"
import type { Client } from "../../clients/types"
import type { ServiceOrder } from "../types"

interface ServiceOrderModalProps {
  isOpen: boolean
  editingServiceOrder: ServiceOrder | null
  clients: Client[]
  onClose: () => void
  onSubmit: (formData: FormData) => void
}

export default function ServiceOrderModal({
  isOpen,
  editingServiceOrder,
  clients,
  onClose,
  onSubmit,
}: ServiceOrderModalProps) {
  const [documentSearch, setDocumentSearch] = useState("")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  useEffect(() => {
    if (!isOpen) return

    if (editingServiceOrder?.client) {
      setDocumentSearch(editingServiceOrder.client.document_number ?? "")
      setSelectedClient({
        id: editingServiceOrder.client.id,
        document_number: editingServiceOrder.client.document_number,
        name: editingServiceOrder.client.name,
        lastName: editingServiceOrder.client.lastName,
        email: editingServiceOrder.client.email,
        phone: editingServiceOrder.client.phone,
      })
    } else {
      setDocumentSearch("")
      setSelectedClient(null)
    }
  }, [isOpen, editingServiceOrder])

  useEffect(() => {
    if (editingServiceOrder) return
    const cleanSearch = documentSearch.trim()
    if (!cleanSearch) {
      setSelectedClient(null)
      return
    }
    const foundClient = clients.find((client) => client.document_number === cleanSearch) ?? null
    setSelectedClient(foundClient)
  }, [documentSearch, clients, editingServiceOrder])

  const fullName = useMemo(() => {
    if (!selectedClient) return ""
    return `${selectedClient.name} ${selectedClient.lastName}`
  }, [selectedClient])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-[2.5rem] bg-white shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
        
        {/* HEADER INSTITUCIONAL */}
        <div className="bg-[#1A237E] px-8 py-6 text-white">
          <h3 className="text-2xl font-bold tracking-tight">
            {editingServiceOrder ? "Editar Orden" : "Nueva Orden"}
          </h3>
          <p className="text-blue-200/70 text-xs uppercase tracking-widest font-medium mt-1">
            Registro de Servicio Técnico
          </p>
        </div>

        <div className="p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit(new FormData(e.currentTarget))
            }}
            className="space-y-5"
          >
            <input type="hidden" name="client" value={selectedClient?.id ?? ""} />

            {/* SEARCH INPUT */}
            <div>
              <label className="block text-sm font-bold text-[#1A237E] mb-2 ml-1">
                Buscar cliente por cédula
              </label>
              <input
                type="text"
                value={documentSearch}
                onChange={(e) => setDocumentSearch(e.target.value)}
                required
                disabled={!!editingServiceOrder}
                placeholder="Ingrese la cédula del cliente"
                className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-3 bg-[#F8F9FA] focus:ring-2 focus:ring-[#1A237E] outline-none transition-all"
              />
            </div>

            {/* MINI CARD CLIENTE */}
            {selectedClient && (
              <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/30 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#1A237E] text-white font-bold shadow-md shadow-indigo-200">
                    {selectedClient.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-sm">{fullName}</span>
                    <span className="text-xs text-slate-500 font-medium">Cédula: {selectedClient.document_number}</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white/80 rounded-lg px-3 py-2 border border-blue-50">
                    <p className="text-slate-400 font-semibold uppercase tracking-tighter">Correo</p>
                    <p className="font-medium text-slate-700 truncate">{selectedClient.email}</p>
                  </div>
                  <div className="bg-white/80 rounded-lg px-3 py-2 border border-blue-50">
                    <p className="text-slate-400 font-semibold uppercase tracking-tighter">Teléfono</p>
                    <p className="font-medium text-slate-700">{selectedClient.phone}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ERROR CLIENTE NO ENCONTRADO */}
            {!selectedClient && documentSearch.trim() !== "" && (
              <p className="text-xs font-bold text-red-500 ml-1 animate-pulse">
                ⚠ No se encontró un cliente con esa cédula
              </p>
            )}

            {/* TIPO INGRESO */}
            <div>
              <label className="block text-sm font-bold text-[#1A237E] mb-2 ml-1">
                Tipo de ingreso
              </label>
              <select
                name="income_type"
                defaultValue={editingServiceOrder?.income_type ?? "externo"}
                required
                disabled={!!editingServiceOrder}
                className="w-full rounded-2xl border border-[#E2E8F0] px-4 py-3 bg-[#F8F9FA] focus:ring-2 focus:ring-[#1A237E] outline-none transition-all text-slate-700"
              >
                <option value="externo">Externo</option>
                <option value="garantia">Garantía</option>
              </select>
            </div>

            {/* BOTONES CENTRADOS Y EQUILIBRADOS */}
            <div className="mt-8 flex items-center justify-center gap-4 pt-2">
              <button
                type="submit"
                disabled={!selectedClient}
                className="min-w-[140px] rounded-xl bg-[#1A237E] px-8 py-3 font-semibold text-white shadow-md shadow-blue-900/20 transition-all active:scale-95 hover:bg-[#121858] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {editingServiceOrder ? "Guardar" : "Registrar"}
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