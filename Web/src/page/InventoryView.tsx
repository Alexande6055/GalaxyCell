import { useState } from "react"
import { Plus, Search, Edit, Trash2, Package } from "lucide-react"
import { toast } from "sonner"
import { BRANDS, CATEGORIES, PRODUCTS, type ProductEntity } from "../utils/Data";

function getStockStatus(quantity: number): { label: string; variant: "disponible" | "bajo_stock" | "agotado" } {
    if (quantity === 0) return { label: "Agotado", variant: "agotado" }
    if (quantity <= 3) return { label: "Stock Bajo", variant: "bajo_stock" }
    return { label: "Disponible", variant: "disponible" }
}

export function InventoryView() {
    const [products, setProducts] = useState<ProductEntity[]>(PRODUCTS)
    const [search, setSearch] = useState("")
    const [filterCategory, setFilterCategory] = useState<string>("all")
    const [filterBrand, setFilterBrand] = useState<string>("all")
    const [filterStock, setFilterStock] = useState<string>("all")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<ProductEntity | null>(null)

    const filteredProducts = products.filter((p) => {
        const matchSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase()) ||
            p.brand.name.toLowerCase().includes(search.toLowerCase()) ||
            p.id.toLowerCase().includes(search.toLowerCase())
        const matchCategory = filterCategory === "all" || p.category.id === filterCategory
        const matchBrand = filterBrand === "all" || p.brand.id === filterBrand
        const stock = getStockStatus(p.quantity)
        const matchStock = filterStock === "all" || stock.variant === filterStock
        return matchSearch && matchCategory && matchBrand && matchStock
    })

    const totalValue = filteredProducts.reduce((acc, p) => acc + p.price * p.quantity, 0)
    const totalUnits = filteredProducts.reduce((acc, p) => acc + p.quantity, 0)

    const handleSave = (product: ProductEntity) => {
        if (editingProduct) {
            setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? product : p)))
            toast.success("Producto actualizado correctamente")
        } else {
            setProducts((prev) => [...prev, product])
            toast.success("Producto agregado correctamente")
        }
        setDialogOpen(false)
        setEditingProduct(null)
    }

    const handleDelete = (id: string) => {
        setProducts((prev) => prev.filter((p) => p.id !== id))
        toast.success("Producto eliminado")
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="font-serif text-xl font-bold">
                        Inventario de Productos
                    </h2>
                    <p className="text-sm text-gray-500">
                        {filteredProducts.length} productos | {totalUnits} unidades | Valor: $
                        {totalValue.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                        })}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setDialogOpen(true)}
                    className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm hover:shadow-md transition"
                >
                    <Plus className="mr-2 size-4" />
                    Agregar Producto
                </button>
            </div>

            {/* Filters */}
            <div className="shadow-sm bg-white rounded-lg">
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                        <input
                            placeholder="Buscar por nombre, descripción, marca o ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-gray-50 pl-9 pr-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full sm:w-44 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Todas las Categorías</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filterBrand}
                        onChange={(e) => setFilterBrand(e.target.value)}
                        className="w-full sm:w-40 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Todas las Marcas</option>
                        {BRANDS.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filterStock}
                        onChange={(e) => setFilterStock(e.target.value)}
                        className="w-full sm:w-40 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Todos</option>
                        <option value="disponible">Disponible</option>
                        <option value="bajo_stock">Stock Bajo</option>
                        <option value="agotado">Agotado</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="shadow-sm bg-white rounded-lg">
                <div className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm divide-y divide-gray-200">
                            <thead className="border-b bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left">ID</th>
                                    <th className="px-4 py-3 text-left">Producto</th>
                                    <th className="px-4 py-3 text-left">Categoría</th>
                                    <th className="px-4 py-3 text-left">Marca</th>
                                    <th className="px-4 py-3 text-right">Precio</th>
                                    <th className="px-4 py-3 text-center">Cantidad</th>
                                    <th className="px-4 py-3 text-left">Estado</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center">
                                            <Package className="mx-auto mb-3 size-10 text-gray-300" />
                                            <p className="text-sm text-gray-500">
                                                No se encontraron productos
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => {
                                        const stock = getStockStatus(product.quantity)

                                        return (
                                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3 font-mono text-xs text-gray-500">
                                                    {product.id}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <div>
                                                        <p className="font-medium">{product.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {product.description}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center rounded-md border border-gray-300 px-2 py-0.5 text-xs font-medium">
                                                        {product.category.name}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3">
                                                    {product.brand.name}
                                                </td>

                                                <td className="px-4 py-3 text-right font-mono">
                                                    ${product.price.toFixed(2)}
                                                </td>

                                                <td className="px-4 py-3 text-center font-mono">
                                                    {product.quantity}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <StockBadge
                                                        variant={stock.variant}
                                                        label={stock.label}
                                                    />
                                                </td>

                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingProduct(product)
                                                                setDialogOpen(true)
                                                            }}
                                                            className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
                                                        >
                                                            <Edit className="size-4" />
                                                            <span className="sr-only">Editar</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(product.id)}
                                                            className="inline-flex items-center justify-center rounded-md p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="size-4" />
                                                            <span className="sr-only">Eliminar</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Manual */}
            {dialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
                        <ProductFormDialog
                            product={editingProduct}
                            onSave={handleSave}
                            onClose={() => {
                                setDialogOpen(false)
                                setEditingProduct(null)
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

function StockBadge({
    variant,
    label,
}: {
    variant: string
    label: string
}) {
    if (variant === "disponible") {
        return (
            <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700">
                {label}
            </span>
        )
    }

    if (variant === "bajo_stock") {
        return (
            <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700">
                {label}
            </span>
        )
    }

    return (
        <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-red-100 text-red-700">
            {label}
        </span>
    )
}

function ProductFormDialog({
    product,
    onSave,
    onClose,
}: {
    product: ProductEntity | null
    onSave: (product: ProductEntity) => void
    onClose: () => void
}) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
        product?.category.id || ""
    )
    const [selectedBrandId, setSelectedBrandId] = useState<string>(
        product?.brand.id || ""
    )

    return (
        <div className="w-full max-w-lg">
            {/* Header */}
            <div className="mb-4">
                <h2 className="font-serif text-lg font-semibold">
                    {product ? "Editar Producto" : "Nuevo Producto"}
                </h2>
                <p className="text-sm text-gray-500">
                    {product
                        ? "Modifica los datos del producto"
                        : "Ingresa los datos del nuevo producto"}
                </p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)

                    const category = CATEGORIES.find(
                        (c) => c.id === selectedCategoryId
                    )
                    const brand = BRANDS.find((b) => b.id === selectedBrandId)

                    if (!category || !brand) {
                        toast.error("Selecciona una categoría y una marca")
                        return
                    }

                    const newProduct: ProductEntity = {
                        id: product?.id || `P${String(Date.now()).slice(-3)}`,
                        name: formData.get("name") as string,
                        description: formData.get("description") as string,
                        price: Number(formData.get("price")),
                        quantity: Number(formData.get("quantity")),
                        category,
                        brand,
                    }

                    onSave(newProduct)
                }}
                className="flex flex-col gap-4"
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Nombre */}
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Nombre
                        </label>
                        <input
                            id="name"
                            name="name"
                            defaultValue={product?.name}
                            required
                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Categoría */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium">Categoría</label>
                        <select
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            required
                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Seleccionar categoría</option>
                            {CATEGORIES.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Marca */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium">Marca</label>
                        <select
                            value={selectedBrandId}
                            onChange={(e) => setSelectedBrandId(e.target.value)}
                            required
                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Seleccionar marca</option>
                            {BRANDS.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Precio */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="price" className="text-sm font-medium">
                            Precio ($)
                        </label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            defaultValue={product?.price}
                            required
                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Cantidad */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="quantity" className="text-sm font-medium">
                            Cantidad
                        </label>
                        <input
                            id="quantity"
                            name="quantity"
                            type="number"
                            min="0"
                            defaultValue={product?.quantity ?? 0}
                            required
                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Descripción */}
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label htmlFor="description" className="text-sm font-medium">
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            defaultValue={product?.description}
                            required
                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm hover:shadow-md transition"
                    >
                        {product ? "Guardar Cambios" : "Agregar Producto"}
                    </button>
                </div>
            </form>
        </div>
    )
}