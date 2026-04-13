import { X, Cpu, Wrench, FileText, AlertTriangle, CheckCircle2 } from "lucide-react"
import type { ServiceDetail } from "../types"

interface ServiceDetailFinalizedProps {
  isOpen: boolean
  detail: ServiceDetail | null
  loading?: boolean
  onClose: () => void
}

export default function ServiceDetailFinalized({
  isOpen,
  detail,
  loading = false,
  onClose,
}: ServiceDetailFinalizedProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-5xl rounded-[2rem] bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-[#2D3ABE] px-8 py-6 text-white flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Detalle finalizado
            </h2>
            <p className="text-blue-100 mt-1 text-sm">
              Información completa del servicio técnico
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-white/10 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {loading ? (
            <div className="py-20 text-center text-slate-500">
              Cargando información...
            </div>
          ) : !detail ? (
            <div className="py-20 text-center text-slate-500">
              No se encontró información del detalle.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-[1.5rem] bg-white border border-slate-100 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Cpu className="size-5 text-[#2D3ABE]" />
                    <h3 className="text-lg font-bold text-[#1A237E]">
                      Información del equipo
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <Info label="Tipo de equipo" value={detail.equipment_type?.name} />
                    <Info label="Serie" value={detail.serial_number} />
                    <Info label="Marca" value={detail.brand} />
                    <Info label="Modelo" value={detail.model} />
                    <Info label="Estado" value={detail.status} />
                    <Info label="Fecha de salida" value={detail.exit_date ?? "---"} />
                  </div>
                </div>

                <div className="rounded-[1.5rem] bg-white border border-slate-100 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="size-5 text-[#2D3ABE]" />
                    <h3 className="text-lg font-bold text-[#1A237E]">
                      Incidencia reportada
                    </h3>
                  </div>

                  <Block
                    label="Falla reportada"
                    value={detail.reported_failure}
                  />

                  <Block
                    label="Observaciones"
                    value={detail.observations}
                    className="mt-4"
                  />
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-white border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Wrench className="size-5 text-[#2D3ABE]" />
                  <h3 className="text-lg font-bold text-[#1A237E]">
                    Diagnóstico técnico
                  </h3>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-line">
                  {detail.technical_diagnosis?.trim() || "No se registró diagnóstico técnico."}
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-white border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="size-5 text-[#2D3ABE]" />
                  <h3 className="text-lg font-bold text-[#1A237E]">
                    Base de conocimiento aplicada
                  </h3>
                </div>

                {!detail.knowledge_base || detail.knowledge_base.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                    No hay soluciones asociadas a este detalle.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {detail.knowledge_base.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-base font-bold text-[#1A237E]">
                              {item.error_title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">
                              Tipo de equipo: {item.equipment_type?.name ?? detail.equipment_type?.name ?? "---"}
                            </p>
                          </div>

                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            <CheckCircle2 className="size-3.5" />
                            Aplicado
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <MiniBlock label="Síntomas" value={item.symptoms} />
                          <MiniBlock label="Causa raíz" value={item.root_cause} />
                          <MiniBlock label="Solución" value={item.solution} />
                        </div>

                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                            Palabras clave
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(item.keywords ?? "")
                              .split(",")
                              .map((keyword) => keyword.trim())
                              .filter(Boolean)
                              .map((keyword, index) => (
                                <span
                                  key={`${item.id}-${index}`}
                                  className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                                >
                                  {keyword}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface InfoProps {
  label: string
  value?: string | null
}

function Info({ label, value }: InfoProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
        {label}
      </p>
      <p className="font-medium text-slate-700">
        {value?.trim() || "---"}
      </p>
    </div>
  )
}

interface BlockProps {
  label: string
  value?: string | null
  className?: string
}

function Block({ label, value, className = "" }: BlockProps) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
        {label}
      </p>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-line">
        {value?.trim() || "---"}
      </div>
    </div>
  )
}

interface MiniBlockProps {
  label: string
  value?: string | null
}

function MiniBlock({ label, value }: MiniBlockProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
        {label}
      </p>
      <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 min-h-[92px] whitespace-pre-line">
        {value?.trim() || "---"}
      </div>
    </div>
  )
}