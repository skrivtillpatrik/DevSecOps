import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "./api";
import UserForm from "./UserForm";
import UserList from "./UserList";

export default function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  async function load() {
    const data = await getUsers();
    setUsers(data.users || data); // beroende på ditt API-format
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(data) {
    await createUser(data);
    load();
  }

  async function handleUpdate(data) {
    await updateUser(editingUser.id, data);
    setEditingUser(null);
    load();
  }

  async function handleDelete(id) {
    await deleteUser(id);
    load();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Användare</h1>

      <UserForm
        onSubmit={editingUser ? handleUpdate : handleCreate}
        existingUser={editingUser}
      />

      <UserList
        users={users}
        onEdit={(u) => setEditingUser(u)}
        onDelete={handleDelete}
      />
    </div>
  );
}