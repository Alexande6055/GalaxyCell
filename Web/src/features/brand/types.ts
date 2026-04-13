export interface Brand {
  id?: string
  name: string
  description: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface BrandListResponse {
  data: Brand[]
  total: number
  page: number
  lastPage: number
}

export interface BrandFormData {
  name: string
  description: string
  isActive?: boolean
}