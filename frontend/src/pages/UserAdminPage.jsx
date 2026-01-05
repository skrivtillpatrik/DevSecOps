import UserForm from "../components/users/UserForm";
import UserList from "../components/users/UserList";
import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api";

export default function UserAdminPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  async function load() {
    const data = await getUsers();
    setUsers(data.users || data);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Användare</h2>

      <UserForm
        onSubmit={editingUser ? (data) => updateUser(editingUser.id, data).then(load) : (data) => createUser(data).then(load)}
        existingUser={editingUser}
      />

      <UserList
        users={users}
        onEdit={(u) => setEditingUser(u)}
        onDelete={(id) => deleteUser(id).then(load)}
      />
    </div>
  );
}