import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts'
import type { FunctionComponent } from 'react'
import { SALES_CHART_DATA, TOP_PRODUCTS } from '../../utils/Data'

const PIE_COLORS = ['#007BFF', '#00E5FF', '#1A237E', '#4FC3F7', '#FF5252']

export const SalesChart: FunctionComponent = () => (
    <div className="rounded-2xl bg-white shadow-sm transition hover:shadow-md lg:col-span-2">
        <div className="px-6 pt-6 pb-2">
            <h3 className="text-base font-semibold text-gray-900">Ventas vs Servicios</h3>
            <p className="text-sm text-gray-500">Últimos 6 meses</p>
        </div>
        <div className="p-6 pt-0">
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SALES_CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="mes" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            formatter={(value) => `$${typeof value === 'number' ? value.toLocaleString() : value}`}
                        />
                        <Bar dataKey="ventas" name="Ventas" fill="#007BFF" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="servicios" name="Servicios" fill="#00E5FF" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
)

export const TopProducts: FunctionComponent = () => (
    <div className="rounded-xl bg-white text-card-foreground shadow-sm card-hover">
        <div className="px-6 pt-6 pb-4">
            <h3 className="font-heading text-base text-gray-900">Productos Más Vendidos</h3>
            <p className="text-sm text-muted-foreground">Top 5 del mes</p>
        </div>
        <div className="p-6 pt-0">
            <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={TOP_PRODUCTS} dataKey="ventas" nameKey="nombre" cx="50%" cy="50%" outerRadius={80} innerRadius={45} strokeWidth={2}>
                            {TOP_PRODUCTS.map((_, i) => (
                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-col gap-2">
                {TOP_PRODUCTS.map((p, i) => (
                    <div key={p.nombre} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <div className="size-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                            <span className="truncate text-muted-foreground">{p.nombre}</span>
                        </div>
                        <span className="font-medium text-foreground">{p.ventas}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
)

export default {
    SalesChart,
    TopProducts,
}
