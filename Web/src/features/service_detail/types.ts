export type IncomeType = "garantia" | "externo"
export type OrderStatus = "pendiente" | "completada"

export type ServiceDetailStatus =
  | "Pendiente"
  | "En proceso"
  | "Completado"
  | "Cancelado"

export interface ServiceOrderClient {
  id?: string
  document_number: string
  name: string
  lastName: string
  email: string
  phone: string
}

export interface EquipmentType {
  id: string
  name: string
}

export interface KnowledgeBaseItem {
  id: string
  title: string
}

export interface ServiceDetail {
  id?: string
  serial_number?: string | null
  brand?: string | null
  model?: string | null
  exit_date?: string | null
  observations?: string | null
  reported_failure: string
  technical_diagnosis?: string | null
  status: ServiceDetailStatus
  equipment_type: EquipmentType
  knowledge_base?: KnowledgeBaseItem[]
  createdAt?: string
  updatedAt?: string
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
  serviceDetails?: ServiceDetail[]
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

export interface ServiceDetailListResponse {
  data: ServiceDetail[]
  total: number
  page: number
  lastPage: number
}

export interface ServiceOrderFormData {
  income_type: IncomeType
  client: string
}

export interface ServiceDetailFormData {
  serial_number?: string
  brand?: string
  model?: string
  observations?: string
  reported_failure: string
  equipment_type: string
  serviceOrder: string
}

export interface EquipmentType {
  id: string;
  name: string;
}

  export interface UpdateServiceDetailStatusFormData {
    status: "En proceso" | "Completado" | "Cancelado"
    technical_diagnosis?: string | null
    knowledge_base_ids?: string[]
  }