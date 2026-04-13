import { api } from "../../../services/api";
import type { Client, ClientListResponse, ClientFormData } from "../types";

export const clientService = {
  // Obtener clientes con paginación
  getClients: async (page = 1, limit = 15) => {
    const url = `/client?page=${page}&limit=${limit}`;
    return await api.get<ClientListResponse>(url);
  },

  createClient: async (data: ClientFormData) => {
    return await api.post<Client>("/client", data);
  },

  updateClient: async (id: string, data: Partial<ClientFormData>) => {
    return await api.patch<Client>(`/client/${id}`, data);
  },

  getClientById: async (id: string) => {
    return await api.get<Client>(`/client/${id}`);
  },

  deleteClient: async (id: string) => {
    return await api.delete<Client>(`/client/${id}`);
  },
};