import { useState } from "react"
import { toast } from "sonner"
import ProductModal from "../components/ProductModal"
import ProductsTopBar from "../components/ProductsTopBar"
import ProductTable from "../components/ProductTable"
import { useProducts } from "../hooks/useProducts"
import { useCategories } from "../../category/hooks/useCategories"
import { useBrands } from "../../brand/hooks/useBrands"
import type { Product } from "../types"
import ProductDetailModal from "../components/ProductDetailModal"

export const ProductsPage = () => {
  const {
    products,
    loading,
    error,
    page,
    lastPage,
    setPage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    toggleStatus,
    setCategoryFilter,
    brandFilter,
    setBrandFilter,
    addProduct,
    updateProduct,
    removeProduct,
  } = useProducts()

  const { categories } = useCategories()
  const { brands } = useBrands()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const handleCreate = async (formData: FormData) => {
    try {
      await addProduct(formData)
      toast.success("Producto registrado")
      setDialogOpen(false)
      setEditingProduct(null)
    } catch (error) {
      console.error(error)
      toast.error("No se pudo registrar el producto")
    }
  }

  const handleUpdate = async (formData: FormData) => {
    if (!editingProduct?.id) return

    try {
      await updateProduct(editingProduct.id, formData)
      toast.success("Producto actualizado")
      setDialogOpen(false)
      setEditingProduct(null)
    } catch (error) {
      console.error(error)
      toast.error("No se pudo actualizar el producto")
    }
  }

  const handleDelete = async (productId: string) => {
    try {
      await removeProduct(productId)
      toast.success("Producto eliminado")
    } catch (error) {
      console.error(error)
      toast.error("No se pudo eliminar el producto")
    }
  }

  const handleToggleStatus = async (product: Product) => {
    try {
      await toggleStatus(product);
      toast.success(`Estado de "${product.name}" actualizado`);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo cambiar el estado");
    }
  };

  if (loading) {
    return <p className="p-4">Cargando productos...</p>
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>
  }
  const handleView = (product: Product) => {
    if (product.id) {
      setSelectedProductId(product.id)
      setDetailModalOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">

      <ProductDetailModal
        isOpen={detailModalOpen}
        productId={selectedProductId}
        onClose={() => {
          setDetailModalOpen(false)
          setSelectedProductId(null)
        }}
      />

      <ProductModal
        isOpen={dialogOpen}
        editingProduct={editingProduct}
        categories={categories}
        brands={brands}
        onClose={() => {
          setDialogOpen(false)
          setEditingProduct(null)
        }}
        onSubmit={(formData) => {
          if (editingProduct) {
            handleUpdate(formData)
          } else {
            handleCreate(formData)
          }
        }}
      />

      <div className="flex w-full flex-col gap-8 p-1">
        <ProductsTopBar
          search={search}
          statusFilter={statusFilter}
          categoryFilter={categoryFilter}
          brandFilter={brandFilter}
          categories={categories}
          brands={brands}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
          onCategoryFilterChange={setCategoryFilter}
          onBrandFilterChange={setBrandFilter}
          onNewClick={() => {
            setEditingProduct(null)
            setDialogOpen(true)
          }}
        />

        <ProductTable
          products={products}
          onViewClick={handleView}
          onEditClick={(product: Product) => {
            setEditingProduct(product)
            setDialogOpen(true)
          }}
          onToggleStatusClick={handleToggleStatus}
        />

        <div className="flex items-center justify-end gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-xl border border-[#E2E8F0] px-4 py-2 disabled:opacity-50"
          >
            Anterior
          </button>

          <span className="text-sm text-[#64748b]">
            Página {page} de {lastPage}
          </span>

          <button
            disabled={page >= lastPage}
            onClick={() => setPage(page + 1)}
            className="rounded-xl border border-[#E2E8F0] px-4 py-2 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}