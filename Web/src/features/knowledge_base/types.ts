export interface EquipmentType {
  id: string
  name: string
}

export interface KnowledgeBase {
  id?: string
  error_title: string
  symptoms: string
  root_cause: string
  solution: string
  keywords: string
  equipment_type: EquipmentType
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface KnowledgeBaseListResponse {
  data: KnowledgeBase[]
  total: number
  page: number
  lastPage: number
}

export interface KnowledgeBaseFormData {
  error_title: string
  symptoms: string
  root_cause: string
  solution: string
  keywords: string
  equipment_type: string
}