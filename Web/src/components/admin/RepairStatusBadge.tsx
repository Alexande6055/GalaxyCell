import React from 'react'
import type { FunctionComponent } from 'react'

function mapStatus(status: string) {
    const map: Record<string, { label: string; className: string }> = {
        recibido: { label: 'Recibido', className: 'bg-muted text-muted-foreground' },
        en_diagnostico: { label: 'Diagnóstico', className: 'bg-amber-100 text-amber-700' },
        en_reparacion: { label: 'En Reparación', className: 'bg-primary/10 text-primary' },
        listo: { label: 'Listo', className: 'bg-emerald-100 text-emerald-700' },
        entregado: { label: 'Entregado', className: 'bg-muted text-muted-foreground' },
    }
    return map[status] || { label: status, className: '' }
}

const RepairStatusBadge: FunctionComponent<{ status: string }> = ({ status }) => {
    const info = mapStatus(status)
    return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${info.className}`}>{info.label}</span>
}

export default RepairStatusBadge
