import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Auth } from "../services/Back-end/Auth"
import type { UserBack } from "../utils/DataTypeBackEnd"
import UserHeader from "../components/UsersView/UserHeader"
import UserSearchBar from "../components/UsersView/UserSearchBar"
import UserTable from "../components/UsersView/UserTable"
import UserModal from "../components/UsersView/UserModal"

export interface UserCreate {
  uidFirebase: string,
  nombre: string,
  password: string,
  rol: "tecnico",
  isActive: boolean,
  email: string,
}

export default function UsersView() {
  const [users, setUsers] = useState<UserBack[]>([])
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserCreate | null>(null)

  useEffect(() => {
    const fetchUserTech = async () => {
      const user = await Auth.listUserTech();
      setUsers(user ? user : [])
    }
    fetchUserTech()
  }, [])
  const filteredUsers = users.filter(
    (u) =>
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      //u.usuario.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = (formData: FormData) => {
    const newUser: UserCreate = {
      uidFirebase: editingUser?.uidFirebase || `U${String(Date.now()).slice(-3)}`,
      nombre: formData.get("nombre") as string,
      //usuario: formData.get("usuario") as string,
      password: formData.get("password") as string,
      rol: "tecnico",
      isActive: editingUser?.isActive || false,
      email: formData.get("email") as string,
      //telefono: formData.get("telefono") as string,
    }

    if (editingUser) {
      setUsers((prev) => prev.map((u) => (u.uidFirebase === editingUser.uidFirebase ? newUser : u)))
      toast.success("Usuario actualizado")
    } else {
      setUsers((prev) => [...prev, newUser])
      toast.success("Usuario registrado")
    }

    setDialogOpen(false)
    setEditingUser(null)
  }

  const handleUpdate = async (formData: FormData) => {
    if (!editingUser) return;

    const passwordValue = formData.get("password") as string;

    const updatePayload = {
      email: formData.get("email") as string,
      nombre: formData.get("nombre") as string,
      password:
        passwordValue && passwordValue.trim() !== ""
          ? passwordValue
          : null,
    };

    const response = await Auth.updateUserTech({ ...updatePayload });

    if (!response) {
      toast.error("No se pudo actualizar el usuario");
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.uidFirebase === editingUser.uidFirebase
          ? { ...u, nombre: updatePayload.nombre, email: updatePayload.email }
          : u
      )
    );

    toast.success("Usuario actualizado");

    setDialogOpen(false);
    setEditingUser(null);
  };
  const toggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.uidFirebase === userId
          ? { ...u, estado: u.isActive ? "bloqueado" : "activo" }
          : u
      )
    )
    toast.success("Estado actualizado")
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-8 p-1 w-full">
        <UserHeader userCount={filteredUsers.length} onNewUserClick={() => setDialogOpen(true)} />
        <UserModal
          isOpen={dialogOpen}
          editingUser={editingUser}
          onClose={() => {
            setDialogOpen(false)
            setEditingUser(null)
          }}
          onSubmit={(formData) => {
            if (editingUser) {
              handleUpdate(formData)
            } else {
              handleCreate(formData)
            }
          }}
        />
        <UserSearchBar value={search} onChange={setSearch} />
        <UserTable
          users={filteredUsers}
          onEditClick={(user) => {
            setEditingUser(user as UserCreate)
            setDialogOpen(true)
          }}
          onToggleStatus={toggleStatus}
        />
      </div>
    </div>
  )
}