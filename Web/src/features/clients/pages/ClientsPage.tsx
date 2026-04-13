import { useMemo, useState } from "react";
import { toast } from "sonner";
import ClientModal from "../components/ClientModal";
import ClientTable from "../components/ClientTable";
import ClientsTopBar from "../components/ClientsTopBar";
import { useClients } from "../hooks/useClients";
import type { Client, ClientFormData } from "../types";

export const ClientsPage = () => {
  const {
    clients,
    loading,
    error,
    page,
    lastPage,
    setPage,
    addClient,
    updateClient,
  } = useClients();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      `${client.name} ${client.lastName} ${client.document_number} ${client.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [clients, search]);

  const handleCreate = async (formData: FormData) => {
    try {
      const data: ClientFormData = {
        name: String(formData.get("first_name") ?? ""),
        lastName: String(formData.get("last_name") ?? ""),
        document_number: String(formData.get("document_number") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
      };

      await addClient(data);
      toast.success("Cliente creado con éxito");
      setDialogOpen(false);
    } catch (error) {
      toast.error("Error al crear cliente");
    }
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingClient?.id) return;

    try {
      const data: Partial<ClientFormData> = {
        name: String(formData.get("first_name") ?? ""),
        lastName: String(formData.get("last_name") ?? ""),
        document_number: String(formData.get("document_number") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
      };

      await updateClient(editingClient.id, data);
      toast.success("Cliente actualizado");
      setDialogOpen(false);
      setEditingClient(null);
    } catch (error) {
      toast.error("Error al actualizar");
    }
  };

  if (loading && clients.length === 0) {
    return <p className="p-8 text-center text-slate-500">Cargando...</p>;
  }

  return (
    <div className="flex flex-col gap-2 bg-gray-50 p-2">
      <ClientModal
        isOpen={dialogOpen}
        editingClient={editingClient}
        onClose={() => {
          setDialogOpen(false);
          setEditingClient(null);
        }}
        onSubmit={editingClient ? handleUpdate : handleCreate}
      />

      {/* Reducido gap de 8 a 4 para eliminar espacio muerto */}
      <div className="flex w-full flex-col gap-4 p-1">
        <ClientsTopBar
          search={search}
          onSearchChange={setSearch}
          onNewClick={() => {
            setEditingClient(null);
            setDialogOpen(true);
          }}
        />

        {/* Bloque de error eliminado (manejado por toast) */}

        <ClientTable
          clients={filteredClients}
          onEditClick={(client) => {
            setEditingClient(client);
            setDialogOpen(true);
          }}
        />

        <div className="flex items-center justify-between py-3 bg-white px-6 rounded-3xl border border-slate-100">
          <span className="text-sm text-slate-500 font-medium">
            Página {page} de {lastPage}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-slate-50 rounded-xl disabled:opacity-50 font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Anterior
            </button>
            <button
              disabled={page >= lastPage}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-slate-50 rounded-xl disabled:opacity-50 font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};