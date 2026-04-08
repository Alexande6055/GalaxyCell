import React from 'react'
import type { FunctionComponent } from 'react'
import { REPAIR_ORDERS } from '../../utils/Data'
import RepairStatusBadge from './RepairStatusBadge'

const RecentRepairs: FunctionComponent<{ isAdmin: boolean }> = ({ isAdmin }) => {
    return (
        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 transition hover:shadow-md">
            <div className="px-6 pt-6 pb-2">
                <h3 className="font-semibold text-base text-slate-900">{isAdmin ? 'Reparaciones Recientes' : 'Mis Reparaciones'}</h3>
                <p className="text-sm text-muted-foreground">Últimas órdenes de servicio</p>
            </div>
            <div className="p-6 pt-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500">
                                <th className="pb-3 pr-4">ID</th>
                                <th className="pb-3 pr-4">Cliente</th>
                                <th className="pb-3 pr-4">Equipo</th>
                                <th className="pb-3 pr-4">Estado</th>
                                <th className="pb-3 pr-4">Técnico</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {REPAIR_ORDERS.slice(0, 5).map((repair) => (
                                <tr key={repair.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 pr-4 font-mono text-xs text-slate-400">#{repair.id}</td>
                                    <td className="py-4 pr-4 font-medium text-slate-700">{repair.clienteNombre}</td>
                                    <td className="py-4 pr-4 text-slate-600">{repair.marca} <span className="text-slate-400 text-xs">{repair.modelo}</span></td>
                                    <td className="py-4 pr-4"><RepairStatusBadge status={repair.estado} /></td>
                                    <td className="py-4 pr-4 text-slate-600">{repair.tecnicoNombre}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default RecentRepairs
