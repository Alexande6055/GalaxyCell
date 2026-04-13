import { useState, useEffect, useCallback } from "react";
import { clientService } from "../services/clientService";
import type { Client, ClientFormData } from "../types";

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await clientService.getClients(page, 15);

      setClients(response.data);
      setPage(response.meta.page);
      setLastPage(response.meta.lastPage);
      setTotal(response.meta.total);
    } catch (err) {
      setError("Error al cargar los clientes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const addClient = async (newClient: ClientFormData) => {
    try {
      setError(null);

      const created = await clientService.createClient(newClient);

      setClients((prev) => [created, ...prev]);
      setTotal((prev) => prev + 1);

      return created;
    } catch (err) {
      setError("No se pudo crear el cliente");
      console.error(err);
      throw err;
    }
  };

  const updateClient = async (id: string, clientData: Partial<ClientFormData>) => {
    try {
      setError(null);

      const updated = await clientService.updateClient(id, clientData);

      setClients((prev) =>
        prev.map((client) => (client.id === id ? updated : client))
      );

      return updated;
    } catch (err) {
      setError("No se pudo actualizar el cliente");
      console.error(err);
      throw err;
    }
  };

  const removeClient = async (id: string) => {
    try {
      setError(null);

      await clientService.deleteClient(id);

      setClients((prev) => prev.filter((client) => client.id !== id));
      setTotal((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      setError("No se pudo eliminar el cliente");
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    loading,
    error,
    page,
    lastPage,
    total,
    setPage,
    refresh: fetchClients,
    addClient,
    updateClient,
    removeClient,
  };
};