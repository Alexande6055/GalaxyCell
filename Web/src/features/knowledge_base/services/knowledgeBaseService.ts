import { api } from "../../../services/api"
import type {
  KnowledgeBase,
  KnowledgeBaseListResponse,
  KnowledgeBaseFormData,
  EquipmentType
} from "../types"

export const knowledgeBaseService = {
  getKnowledgeBase: async (
    page = 1,
    limit = 15,
    equipmentTypeId?: string
  ) => {
    let url = `/knowledge-base?page=${page}&limit=${limit}`

    if (equipmentTypeId) {
      url += `&equipmentTypeId=${equipmentTypeId}`
    }

    return await api.get<KnowledgeBaseListResponse>(url)
  },

  createKnowledge: async (data: KnowledgeBaseFormData) => {
    return await api.post<KnowledgeBase>("/knowledge-base", data)
  },

  updateKnowledge: async (
    id: string,
    data: Partial<KnowledgeBaseFormData>
  ) => {
    return await api.patch<KnowledgeBase>(`/knowledge-base/${id}`, data)
  },

  getKnowledgeById: async (id: string) => {
    return await api.get<KnowledgeBase>(`/knowledge-base/${id}`)
  },

  deleteKnowledge: async (id: string) => {
    return await api.delete<{ message: string }>(
      `/knowledge-base/${id}`
    )
  },
    getEquipmentTypes: async () => {
      return await api.get<EquipmentType[]>("/equipment-types")
    },
}