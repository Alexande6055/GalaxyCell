export interface ProductRelation {
  id?: string
  name: string
}

export interface Product {
  id?: string
  name: string
  description: string
  price: number
  quantity: number
  coverImagePath?: string | null
  isActive: boolean
  createdAt?: string
  updatedAt?: string
  category?: ProductRelation
  brand?: ProductRelation
}

export interface ProductListResponse {
  data: Product[]
  total: number
  page: number
  lastPage: number
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  quantity: number
  coverImagePath?: string
  category?: string
  brand?: string
  isActive?: boolean
}

export interface ProductFilters {
  search?: string
  category?: string
  brand?: string
  isActive?: string
  page?: number
  limit?: number
}