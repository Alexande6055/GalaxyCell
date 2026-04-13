import { useState, useEffect, useCallback } from "react";
import { serviceDetailService } from "../services/serviceDetailService";
import type {
  ServiceDetail,
  ServiceDetailFormData,
  UpdateServiceDetailStatusFormData,
  EquipmentType,
} from "../types";

export const useServiceDetails = (serviceOrderId?: string) => {
  // Estados de datos
  const [serviceDetails, setServiceDetails] = useState<ServiceDetail[]>([]);
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([]);
  
  // Estados de UI
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estados de Paginación y Filtros
  const [page, setPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>("");

  /**
   * Carga los tipos de equipos (Celulares, Laptops, etc.)
   * Se usa para los selectores en los formularios de creación.
   */
  const fetchEquipmentTypes = useCallback(async () => {
    try {
      const response = await serviceDetailService.getEquipmentTypes();
      // Asumimos que la respuesta es directamente el array de tipos
      setEquipmentTypes(response);
    } catch (err) {
      console.error("Error al cargar tipos de equipos:", err);
    }
  }, []);

  /**
   * Carga la lista de detalles asociados a una orden de servicio específica
   */
  const fetchServiceDetails = useCallback(async () => {
    if (!serviceOrderId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await serviceDetailService.getServiceDetails(
        serviceOrderId,
        page,
        15,
        statusFilter || undefined
      );

      // Adaptación según la estructura de ServiceDetailListResponse
      setServiceDetails(response.data);
      setPage(response.page);
      setLastPage(response.lastPage);
      setTotal(response.total);
    } catch (err) {
      setError("Error al cargar los detalles del servicio");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, serviceOrderId]);

  /**
   * Agrega un nuevo detalle (recepción de equipo) a la orden
   */
  const addServiceDetail = async (data: ServiceDetailFormData) => {
    try {
      setError(null);
      const created = await serviceDetailService.createServiceDetail(data);
      
      // Actualizamos la lista local para feedback inmediato
      setServiceDetails((prev) => [...prev, created]);
      setTotal((prev) => prev + 1);
      
      return created;
    } catch (err) {
      setError("No se pudo crear el detalle del servicio");
      console.error(err);
      throw err;
    }
  };

  /**
   * Finaliza un detalle técnico (diagnóstico final)
   */
// En useServiceDetails.ts
// useServiceDetails.ts
const updateDetail = async (id: string, data: UpdateServiceDetailStatusFormData) => {
  if (!serviceOrderId || !id) return;
  try {
    setError(null);
    const response = await serviceDetailService.updateServiceDetailStatus(id, serviceOrderId, data);

    // Separamos el flag de los datos del detalle para no romper el tipado
    const { orderAutoClosed, ...updatedDetail } = response as any;

    setServiceDetails((prev) =>
      prev.map((item) => (item.id === id ? updatedDetail : item))
    );

    return response; // Retornamos todo para que la página vea el flag
  } catch (err) {
    setError("No se pudo actualizar el detalle");
    throw err;
  }
};
  /**
   * Elimina físicamente (o lógicamente según API) un detalle
   */
  const removeServiceDetail = async (id: string) => {
    if (!serviceOrderId) return;

    try {
      setError(null);
      await serviceDetailService.deleteServiceDetail(id, serviceOrderId);
      
      setServiceDetails((prev) => prev.filter((item) => item.id !== id));
      setTotal((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      setError("No se pudo eliminar el detalle del servicio");
      console.error(err);
      throw err;
    }
  };

  // --- EFECTOS ---

  // Efecto para cargar tipos de equipos una sola vez al montar
  useEffect(() => {
    fetchEquipmentTypes();
  }, [fetchEquipmentTypes]);

  // Efecto para recargar detalles cuando cambie la orden, página o filtro
  useEffect(() => {
    fetchServiceDetails();
  }, [fetchServiceDetails]);

  return {
    // Datos
    serviceDetails,
    equipmentTypes,
    
    // Estado de carga/error
    loading,
    error,
    
    // Paginación y Filtros
    page,
    lastPage,
    total,
    setPage,
    statusFilter,
    setStatusFilter,
    
    // Acciones
    refresh: fetchServiceDetails,
    addServiceDetail,
    updateDetail,
    removeServiceDetail,
  };
};