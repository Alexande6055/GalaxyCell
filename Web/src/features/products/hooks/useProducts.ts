import { useState, useEffect, useCallback } from "react"
import { productService } from "../services/productService"
import type { Product } from "../types"

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  const [search, setSearch] = useState<string>("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [brandFilter, setBrandFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await productService.getProducts({
        page,
        limit: 15,
        search,
        category: categoryFilter,
        brand: brandFilter,
        isActive: statusFilter,
      })

      setProducts(response.data)
      setPage(response.page)
      setLastPage(response.lastPage)
      setTotal(response.total)
    } catch (err) {
      setError("Error al cargar los productos")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search, categoryFilter, brandFilter, statusFilter])

  const addProduct = async (newProduct: FormData) => {
    try {
      setError(null)

      const created = await productService.createProduct(newProduct)

      await fetchProducts()
      return created
    } catch (err) {
      setError("No se pudo crear el producto")
      console.error(err)
      throw err
    }
  }

  const updateProduct = async (id: number | string, productData: FormData) => {
    try {
      setError(null)

      const updated = await productService.updateProduct(id, productData)

      setProducts((prev) =>
        prev.map((product) => (product.id === id ? updated : product))
      )

      return updated
    } catch (err) {
      setError("No se pudo actualizar el producto")
      console.error(err)
      throw err
    }
  }

  const toggleStatus = async (product: Product) => {
    if (!product.id) return

    try {
      setError(null)

      const updated = await productService.toggleProductStatus(product.id)

      setProducts((prev) =>
        prev.map((item) => (item.id === product.id ? updated : item))
      )

      return updated
    } catch (err) {
      setError("No se pudo cambiar el estado del producto")
      console.error(err)
      throw err
    }
  }
  
const getDetail = useCallback(async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProductDetail(id);
      setSelectedProduct(data);
      return data;
    } catch (err) {
      setError("No se pudo obtener el detalle del producto");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
  const removeProduct = async (id: number | string) => {
    // try {
    //   setError(null)

    //   await productService.deleteProduct(id)

    //   setProducts((prev) => prev.filter((product) => product.id !== id))
    //   setTotal((prev) => Math.max(prev - 1, 0))
    // } catch (err) {
    //   setError("No se pudo eliminar el producto")
    //   console.error(err)
    //   throw err
    // }
  }

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    page,
    lastPage,
    total,
    setPage,
    refresh: fetchProducts,

    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    brandFilter,
    setBrandFilter,
    statusFilter,
    setStatusFilter,
getDetail,
    addProduct,
    updateProduct,
    toggleStatus,
    removeProduct,
  }
}