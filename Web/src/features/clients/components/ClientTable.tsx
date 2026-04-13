  import { Edit } from "lucide-react";
  import type { Client } from "../types";

  interface ClientTableProps {
    clients: Client[];
    onEditClick: (client: Client) => void;
  }

  export default function ClientTable({ clients, onEditClick }: ClientTableProps) {
    return (
      <div className="relative overflow-x-auto rounded-[2rem] bg-white shadow-xl shadow-blue-900/5 border border-slate-100">
        <table className="w-full text-sm text-left border-separate border-spacing-0">
          <thead className="bg-[#2D3ABE] text-white"> {/* Un azul más claro y vibrante que el sidebar */}
            <tr>
              <th className="px-6 py-5 font-bold uppercase tracking-wide rounded-tl-[2rem]">Cliente</th>
              <th className="px-6 py-5 font-bold uppercase tracking-wide">Documento</th>
              <th className="px-6 py-5 font-bold uppercase tracking-wide">Teléfono</th>
              <th className="px-6 py-5 font-bold uppercase tracking-wide">Correo</th>
              <th className="px-6 py-5 font-bold uppercase tracking-wide text-right rounded-tr-[2rem]">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {clients.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-slate-400 font-medium">
                  No se encontraron registros
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr 
                  key={client.id} 
                  className="group transition-all duration-200 hover:bg-blue-50/40"
                >
                  <td className="px-6 py-4 font-bold text-[#1A237E] border-b border-slate-50">
                    {client.name} {client.lastName}
                  </td>
                  <td className="px-6 py-4 text-slate-600 border-b border-slate-50">
                    {client.document_number}
                  </td>
                  <td className="px-6 py-4 text-slate-600 border-b border-slate-50">
                    {client.phone}
                  </td>
                  <td className="px-6 py-4 text-slate-600 border-b border-slate-50">
                    {client.email}
                  </td>
                  <td className="px-6 py-4 text-right border-b border-slate-50">
                    <div className="flex justify-end">
                      <button
                        onClick={() => onEditClick(client)}
                        className="p-2.5 bg-blue-50 text-[#2D3ABE] rounded-xl hover:bg-[#2D3ABE] hover:text-white transition-all duration-300"
                      >
                        <Edit className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }