import { X, User, FileText, CheckCircle2, Package, Calendar, MapPin } from "lucide-react"

interface ServiceOrderFinalizedProps {
  isOpen: boolean
  data: any | null // Aquí viene la estructura de tu nuevo método detail()
  loading?: boolean
  onClose: () => void
}

export default function ServiceOrderFinalized({
  isOpen,
  data,
  loading = false,
  onClose,
}: ServiceOrderFinalizedProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-6xl rounded-[2.5rem] bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1A237E] px-10 py-8 text-white flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <CheckCircle2 size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
               <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Completada
              </span>
              <span className="text-blue-200 text-sm font-medium">Orden #{data?.order_info?.order_number}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Resumen de Servicio Finalizado</h2>
            <p className="text-blue-100 mt-1 text-sm">Registro histórico de equipos y soluciones aplicadas</p>
          </div>
          <button onClick={onClose} className="rounded-2xl p-3 hover:bg-white/10 transition-all border border-white/10 relative z-10">
            <X className="size-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50 scrollbar-thin scrollbar-thumb-slate-200">
          {loading ? (
            <div className="py-20 text-center space-y-4">
               <div className="animate-spin size-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
               <p className="text-slate-500 font-medium">Generando resumen detallado...</p>
            </div>
          ) : !data ? (
            <div className="py-20 text-center text-slate-500">No se encontró información.</div>
          ) : (
            <div className="space-y-8">
              {/* Grid de Información General y Cliente */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                  {/* Card Cliente */}
                  <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 bg-blue-50 rounded-xl"><User className="size-5 text-blue-600" /></div>
                      <h3 className="text-lg font-bold text-slate-800">Cliente</h3>
                    </div>
                    <div className="space-y-4">
                      <DataEntry label="Nombre Completo" value={`${data.client_info.name} ${data.client_info.lastName}`} />
                      <DataEntry label="Documento" value={data.client_info.document_number} />
                    </div>
                  </div>

                  {/* Card Orden */}
                  <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 bg-indigo-50 rounded-xl"><Calendar className="size-5 text-indigo-600" /></div>
                      <h3 className="text-lg font-bold text-slate-800">Tiempos</h3>
                    </div>
                    <div className="space-y-4">
                      <DataEntry label="Ingreso" value={new Date(data.order_info.entry_date).toLocaleDateString()} />
                      <DataEntry label="Salida Total" value={data.order_info.exit_date ? new Date(data.order_info.exit_date).toLocaleDateString() : '---'} />
                    </div>
                  </div>
                </div>

                {/* Lista de Detalles (Equipos) */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between mb-2">
                     <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Package className="text-blue-600" /> Equipos Procesados
                     </h3>
                     <span className="text-sm font-medium text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
                        {data.details.length} Items
                     </span>
                  </div>

                  {data.details.map((detail: any, index: number) => (
                    <div key={detail.id} className="rounded-[2rem] bg-white border border-slate-200 shadow-sm overflow-hidden transition-hover hover:shadow-md">
                      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <span className="font-bold text-[#1A237E]">Equipo #{index + 1}: {detail.equipment_type}</span>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${detail.status === 'Completado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {detail.status}
                        </span>
                      </div>
                      
                      <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           <InfoItem label="Marca" value={detail.brand} />
                           <InfoItem label="Modelo" value={detail.model} />
                           <InfoItem label="Serie" value={detail.serial_number} />
                           <InfoItem label="Entrega" value={detail.exit_date ? new Date(detail.exit_date).toLocaleDateString() : '---'} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Falla Reportada</p>
                              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">{detail.reported_failure}</div>
                           </div>
                           <div className="space-y-2">
                              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Diagnóstico Técnico</p>
                              <div className="p-3 bg-blue-50/30 rounded-xl text-xs text-blue-700 border border-blue-100/50">{detail.technical_diagnosis}</div>
                           </div>
                        </div>

                        {/* Soluciones KB */}
                        {detail.applied_solutions?.length > 0 && (
                          <div className="pt-4 border-t border-dashed border-slate-200">
                             <p className="text-[10px] font-bold text-green-600 uppercase mb-3 flex items-center gap-1">
                                <FileText size={12} /> Soluciones de Base de Conocimientos
                             </p>
                             <div className="grid grid-cols-1 gap-3">
                                {detail.applied_solutions.map((sol: any) => (
                                  <div key={sol.id} className="p-4 bg-green-50/30 border border-green-100 rounded-2xl">
                                     <p className="text-sm font-bold text-slate-800 mb-1">{sol.error_title}</p>
                                     <p className="text-xs text-slate-600 leading-relaxed"><span className="font-semibold">Acción:</span> {sol.solution}</p>
                                  </div>
                                ))}
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DataEntry({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-semibold text-slate-700">{value}</p>
    </div>
  )
}

function InfoItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[9px] font-bold text-slate-400 uppercase">{label}</p>
      <p className="text-xs font-medium text-slate-600 truncate">{value || '---'}</p>
    </div>
  )
}