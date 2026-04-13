import { useState, useEffect, useCallback } from "react"
import { knowledgeBaseService } from "../services/knowledgeBaseService"
import type {
  KnowledgeBase,
  KnowledgeBaseFormData,
  EquipmentType,
} from "../types"

export const useKnowledgeBase = () => {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase[]>([])
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([])

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [equipmentTypeId, setEquipmentTypeId] = useState<string>("")

  const fetchEquipmentTypes = useCallback(async () => {
    try {
      const response = await knowledgeBaseService.getEquipmentTypes()
      setEquipmentTypes(response)
    } catch (err) {
      console.error("Error al cargar los tipos de equipo", err)
    }
  }, [])

  const fetchKnowledgeBase = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await knowledgeBaseService.getKnowledgeBase(
        page,
        15,
        equipmentTypeId || undefined
      )

      setKnowledgeBase(response.data)
      setPage(response.page)
      setLastPage(response.lastPage)
      setTotal(response.total)
    } catch (err) {
      setError("Error al cargar la base de conocimiento")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, equipmentTypeId])

  const addKnowledgeBase = async (newKnowledge: KnowledgeBaseFormData) => {
    try {
      setError(null)

      const created = await knowledgeBaseService.createKnowledge(newKnowledge)

      setKnowledgeBase((prev) => [...prev, created])
      setTotal((prev) => prev + 1)

      return created
    } catch (err) {
      setError("No se pudo crear el registro")
      console.error(err)
      throw err
    }
  }

  const updateKnowledgeBase = async (
    id: string,
    knowledgeData: Partial<KnowledgeBaseFormData>
  ) => {
    try {
      setError(null)

      const updated = await knowledgeBaseService.updateKnowledge(id, knowledgeData)

      setKnowledgeBase((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      )

      return updated
    } catch (err) {
      setError("No se pudo actualizar el registro")
      console.error(err)
      throw err
    }
  }

  const removeKnowledgeBase = async (id: string) => {
    try {
      setError(null)

      await knowledgeBaseService.deleteKnowledge(id)

      setKnowledgeBase((prev) => prev.filter((item) => item.id !== id))
      setTotal((prev) => Math.max(prev - 1, 0))
    } catch (err) {
      setError("No se pudo eliminar el registro")
      console.error(err)
      throw err
    }
  }

  useEffect(() => {
    fetchEquipmentTypes()
  }, [fetchEquipmentTypes])

  useEffect(() => {
    fetchKnowledgeBase()
  }, [fetchKnowledgeBase])

  return {
    knowledgeBase,
    equipmentTypes,
    loading,
    error,
    page,
    lastPage,
    total,
    setPage,
    equipmentTypeId,
    setEquipmentTypeId,
    refresh: fetchKnowledgeBase,
    addKnowledgeBase,
    updateKnowledgeBase,
    removeKnowledgeBase,
  }
}