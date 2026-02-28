export function FontStyle() {
    return (<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        h1,h2,h3,.font-display { font-family: 'Montserrat', sans-serif; }
        .glass { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); }
        .glass-light { backdrop-filter: blur(8px); background: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.4); }
        .btn-primary { background: linear-gradient(135deg, #007BFF 0%, #00E5FF 100%); }
        .btn-primary:hover { background: linear-gradient(135deg, #0056CC 0%, #00B8CC 100%); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,123,255,0.35); }
    .sidebar-item:hover { background: rgba(255,255,255,0.1); }
    .sidebar-item.active { background: rgba(0,229,255,0.2); border-right: 3px solid #00E5FF; }
    .card-hover { transition: transform 0.2s, box-shadow 0.2s; }
    .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.1); }
    .dark-bg { background-color: #121212; }
    .dark-surface { background-color: #1E1E1E; }
    .dark-surface2 { background-color: #2A2A2A; }
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #007BFF55; border-radius: 10px; }
    .table-row-hover:hover { background-color: rgba(0,123,255,0.04); }
    input:focus, select:focus, textarea:focus { outline: none; border-color: #007BFF; box-shadow: 0 0 0 3px rgba(0,123,255,0.15); }
    @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    .fade-in { animation: fadeIn 0.3s ease forwards; }
    @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .pulse-dot { animation: pulse-dot 2s infinite; }
    `}</style>)
}

export const USERS_DB = [
    { id: 1, username: "admin", password: "admin123", role: "admin", name: "Carlos Mendoza", email: "carlos@galaxycell.com", status: "active", avatar: "CM" },
    { id: 2, username: "tecnico1", password: "tech123", role: "technician", name: "Luis Herrera", email: "luis@galaxycell.com", status: "active", avatar: "LH" },
    { id: 3, username: "tecnico2", password: "tech456", role: "technician", name: "Ana Ríos", email: "ana@galaxycell.com", status: "active", avatar: "AR" },
];
export const NOTIFICATIONS = [
    { id: 1, type: "ready", message: "Equipo de Elena Castro (SRV-001) listo para retirar", time: "Hace 10 min", read: false, serviceId: "SRV-001" },
    { id: 2, type: "assigned", message: "Nueva orden SRV-006 asignada a ti", time: "Hace 30 min", read: false, serviceId: "SRV-006" },
    { id: 3, type: "parts", message: "Repuesto para SRV-004 en camino", time: "Hace 2 hrs", read: true, serviceId: "SRV-004" },
    { id: 4, type: "reminder", message: "SRV-002 vence mañana 28/02", time: "Hace 3 hrs", read: true, serviceId: "SRV-002" },
];

export type ProductCategory = "celular" | "accesorio"

export interface Product {
    id: string
    nombre: string
    categoria: ProductCategory
    marca: string
    modelo: string
    imei?: string
    precio_compra: number
    precio_venta: number
    stock: number
    estado: "disponible" | "agotado" | "bajo_stock"
    imagen?: string
    descripcion: string
}

export const PRODUCTS: Product[] = [
    {
        id: "P001",
        nombre: "Samsung Galaxy S24 Ultra",
        categoria: "celular",
        marca: "Samsung",
        modelo: "Galaxy S24 Ultra",
        imei: "354789102345671",
        precio_compra: 850,
        precio_venta: 1199.99,
        stock: 8,
        estado: "disponible",
        descripcion: "256GB, Titanium Black, 5G",
    },
    {
        id: "P002",
        nombre: "iPhone 15 Pro Max",
        categoria: "celular",
        marca: "Apple",
        modelo: "iPhone 15 Pro Max",
        imei: "354789102345672",
        precio_compra: 900,
        precio_venta: 1299.99,
        stock: 5,
        estado: "disponible",
        descripcion: "256GB, Natural Titanium, 5G",
    },
    {
        id: "P003",
        nombre: "Xiaomi Redmi Note 13 Pro",
        categoria: "celular",
        marca: "Xiaomi",
        modelo: "Redmi Note 13 Pro",
        imei: "354789102345673",
        precio_compra: 180,
        precio_venta: 299.99,
        stock: 15,
        estado: "disponible",
        descripcion: "128GB, Midnight Black, 4G",
    },
    {
        id: "P004",
        nombre: "Samsung Galaxy A15",
        categoria: "celular",
        marca: "Samsung",
        modelo: "Galaxy A15",
        imei: "354789102345674",
        precio_compra: 110,
        precio_venta: 189.99,
        stock: 2,
        estado: "bajo_stock",
        descripcion: "128GB, Blue Black, 4G",
    },
    {
        id: "P005",
        nombre: "Motorola Edge 40 Neo",
        categoria: "celular",
        marca: "Motorola",
        modelo: "Edge 40 Neo",
        imei: "354789102345675",
        precio_compra: 220,
        precio_venta: 349.99,
        stock: 0,
        estado: "agotado",
        descripcion: "256GB, Black Beauty, 5G",
    },
    {
        id: "P006",
        nombre: "Funda Samsung S24 Ultra",
        categoria: "accesorio",
        marca: "Samsung",
        modelo: "Funda Original S24 Ultra",
        precio_compra: 12,
        precio_venta: 29.99,
        stock: 30,
        estado: "disponible",
        descripcion: "Funda de silicona original color negro",
    },
    {
        id: "P007",
        nombre: "Cargador Rápido USB-C 65W",
        categoria: "accesorio",
        marca: "Anker",
        modelo: "Nano II 65W",
        precio_compra: 18,
        precio_venta: 39.99,
        stock: 25,
        estado: "disponible",
        descripcion: "Cargador rápido GaN con USB-C",
    },
    {
        id: "P008",
        nombre: "AirPods Pro 2da Gen",
        categoria: "accesorio",
        marca: "Apple",
        modelo: "AirPods Pro 2",
        precio_compra: 150,
        precio_venta: 249.99,
        stock: 3,
        estado: "bajo_stock",
        descripcion: "Con estuche MagSafe, cancelación de ruido",
    },
    {
        id: "P009",
        nombre: "Protector Pantalla iPhone 15",
        categoria: "accesorio",
        marca: "Spigen",
        modelo: "GlasTR EZ Fit",
        precio_compra: 5,
        precio_venta: 14.99,
        stock: 50,
        estado: "disponible",
        descripcion: "Vidrio templado 9H con guía de instalación",
    },
    {
        id: "P010",
        nombre: "Cable Lightning 2m",
        categoria: "accesorio",
        marca: "Apple",
        modelo: "Cable Original Lightning",
        precio_compra: 8,
        precio_venta: 19.99,
        stock: 0,
        estado: "agotado",
        descripcion: "Cable Lightning a USB-C original 2 metros",
    },
]


// --- Ventas ---
export interface SaleItem {
  productoId: string
  nombre: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export interface Sale {
  id: string
  clienteId: string
  clienteNombre: string
  items: SaleItem[]
  total: number
  metodo_pago: "efectivo" | "tarjeta" | "transferencia"
  fecha: string
  vendedorId: string
  vendedorNombre: string
  estado: "completada" | "pendiente" | "cancelada"
}

export const SALES: Sale[] = [
  {
    id: "V001",
    clienteId: "C001",
    clienteNombre: "José Hernández",
    items: [
      { productoId: "P002", nombre: "iPhone 15 Pro Max", cantidad: 1, precio_unitario: 1299.99, subtotal: 1299.99 },
      { productoId: "P009", nombre: "Protector Pantalla iPhone 15", cantidad: 2, precio_unitario: 14.99, subtotal: 29.98 },
    ],
    total: 1329.97,
    metodo_pago: "tarjeta",
    fecha: "2025-02-15",
    vendedorId: "U001",
    vendedorNombre: "Carlos Mendoza",
    estado: "completada",
  },
  {
    id: "V002",
    clienteId: "C002",
    clienteNombre: "Laura Martínez",
    items: [
      { productoId: "P003", nombre: "Xiaomi Redmi Note 13 Pro", cantidad: 1, precio_unitario: 299.99, subtotal: 299.99 },
      { productoId: "P007", nombre: "Cargador Rápido USB-C 65W", cantidad: 1, precio_unitario: 39.99, subtotal: 39.99 },
    ],
    total: 339.98,
    metodo_pago: "efectivo",
    fecha: "2025-02-18",
    vendedorId: "U001",
    vendedorNombre: "Carlos Mendoza",
    estado: "completada",
  },
  {
    id: "V003",
    clienteId: "C003",
    clienteNombre: "Pedro Sánchez",
    items: [
      { productoId: "P001", nombre: "Samsung Galaxy S24 Ultra", cantidad: 1, precio_unitario: 1199.99, subtotal: 1199.99 },
      { productoId: "P006", nombre: "Funda Samsung S24 Ultra", cantidad: 1, precio_unitario: 29.99, subtotal: 29.99 },
    ],
    total: 1229.98,
    metodo_pago: "transferencia",
    fecha: "2025-02-20",
    vendedorId: "U001",
    vendedorNombre: "Carlos Mendoza",
    estado: "completada",
  },
  {
    id: "V004",
    clienteId: "C004",
    clienteNombre: "Carmen Ruiz",
    items: [
      { productoId: "P008", nombre: "AirPods Pro 2da Gen", cantidad: 1, precio_unitario: 249.99, subtotal: 249.99 },
    ],
    total: 249.99,
    metodo_pago: "efectivo",
    fecha: "2025-02-22",
    vendedorId: "U001",
    vendedorNombre: "Carlos Mendoza",
    estado: "pendiente",
  },
  {
    id: "V005",
    clienteId: "C005",
    clienteNombre: "Miguel Torres",
    items: [
      { productoId: "P004", nombre: "Samsung Galaxy A15", cantidad: 2, precio_unitario: 189.99, subtotal: 379.98 },
    ],
    total: 379.98,
    metodo_pago: "tarjeta",
    fecha: "2025-02-25",
    vendedorId: "U001",
    vendedorNombre: "Carlos Mendoza",
    estado: "cancelada",
  },
]

// --- Órdenes de Reparación ---
export interface RepairOrder {
  id: string
  clienteId: string
  clienteNombre: string
  equipo: string
  marca: string
  modelo: string
  imei?: string
  problema: string
  diagnostico: string
  estado: "recibido" | "en_diagnostico" | "en_reparacion" | "listo" | "entregado"
  tecnicoId: string
  tecnicoNombre: string
  costo_estimado: number
  costo_final?: number
  fecha_ingreso: string
  fecha_estimada: string
  fecha_entrega?: string
  notas: string
}

export const REPAIR_ORDERS: RepairOrder[] = [
  {
    id: "R001",
    clienteId: "C001",
    clienteNombre: "José Hernández",
    equipo: "Celular",
    marca: "Samsung",
    modelo: "Galaxy S23",
    imei: "354789102345690",
    problema: "Pantalla rota por caída",
    diagnostico: "Reemplazo de display AMOLED completo",
    estado: "en_reparacion",
    tecnicoId: "U002",
    tecnicoNombre: "Ana López",
    costo_estimado: 120,
    fecha_ingreso: "2025-02-20",
    fecha_estimada: "2025-02-27",
    notas: "Cliente solicita pantalla original",
  },
  {
    id: "R002",
    clienteId: "C002",
    clienteNombre: "Laura Martínez",
    equipo: "Celular",
    marca: "Apple",
    modelo: "iPhone 14",
    imei: "354789102345691",
    problema: "No carga el dispositivo",
    diagnostico: "Puerto de carga dañado - requiere microsoldadura",
    estado: "en_diagnostico",
    tecnicoId: "U003",
    tecnicoNombre: "Roberto García",
    costo_estimado: 45,
    fecha_ingreso: "2025-02-22",
    fecha_estimada: "2025-02-28",
    notas: "Revisar posible daño por líquido",
  },
  {
    id: "R003",
    clienteId: "C003",
    clienteNombre: "Pedro Sánchez",
    equipo: "Celular",
    marca: "Xiaomi",
    modelo: "Poco X5",
    problema: "Batería se agota muy rápido",
    diagnostico: "Batería degradada al 62%, reemplazo necesario",
    estado: "listo",
    tecnicoId: "U002",
    tecnicoNombre: "Ana López",
    costo_estimado: 30,
    costo_final: 30,
    fecha_ingreso: "2025-02-18",
    fecha_estimada: "2025-02-23",
    notas: "Batería original Xiaomi instalada",
  },
  {
    id: "R004",
    clienteId: "C004",
    clienteNombre: "Carmen Ruiz",
    equipo: "Celular",
    marca: "Motorola",
    modelo: "Moto G54",
    problema: "Software dañado, no enciende",
    diagnostico: "Flasheo de firmware y recuperación de datos",
    estado: "recibido",
    tecnicoId: "U003",
    tecnicoNombre: "Roberto García",
    costo_estimado: 25,
    fecha_ingreso: "2025-02-25",
    fecha_estimada: "2025-03-01",
    notas: "Cliente pide respaldo de fotos si es posible",
  },
  {
    id: "R005",
    clienteId: "C005",
    clienteNombre: "Miguel Torres",
    equipo: "Celular",
    marca: "Samsung",
    modelo: "Galaxy A34",
    problema: "Altavoz no funciona",
    diagnostico: "Altavoz inferior dañado",
    estado: "entregado",
    tecnicoId: "U002",
    tecnicoNombre: "Ana López",
    costo_estimado: 20,
    costo_final: 20,
    fecha_ingreso: "2025-02-10",
    fecha_estimada: "2025-02-14",
    fecha_entrega: "2025-02-14",
    notas: "Reparación exitosa",
  },
]
// --- Datos para gráficos del Dashboard ---
export const SALES_CHART_DATA = [
  { mes: "Sep", ventas: 4200, servicios: 1800 },
  { mes: "Oct", ventas: 5100, servicios: 2200 },
  { mes: "Nov", ventas: 6800, servicios: 2500 },
  { mes: "Dic", ventas: 9200, servicios: 3100 },
  { mes: "Ene", ventas: 5500, servicios: 2000 },
  { mes: "Feb", ventas: 7300, servicios: 2800 },
]

export const TOP_PRODUCTS = [
  { nombre: "iPhone 15 Pro Max", ventas: 24 },
  { nombre: "Samsung Galaxy S24 Ultra", ventas: 19 },
  { nombre: "Xiaomi Redmi Note 13 Pro", ventas: 35 },
  { nombre: "Cargador USB-C 65W", ventas: 48 },
  { nombre: "AirPods Pro 2", ventas: 15 },
]