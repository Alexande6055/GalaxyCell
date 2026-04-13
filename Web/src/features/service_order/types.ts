export type IncomeType = "garantia" | "externo"
export type OrderStatus = "pendiente" | "completada"

export interface ServiceOrderClient {
  id?: string
  document_number: string
  name: string
  lastName: string
  email: string
  phone: string
}

export interface ServiceOrder {
  id?: string
  order_number: string
  income_type: IncomeType
  status: OrderStatus
  entry_date: string
  exit_date?: string | null
  client: ServiceOrderClient
  detailsCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface ServiceOrderListResponse {
  data: ServiceOrder[]
  meta: {
    total: number
    page: number
    lastPage: number
  }
}

export interface ServiceOrderFormData {
  income_type: IncomeType
  client: string
}