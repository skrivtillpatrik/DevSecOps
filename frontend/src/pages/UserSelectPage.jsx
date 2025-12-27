import { useEffect, useState } from "react";
import { getUsers, createUser } from "../api";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import UserForm from "../components/users/UserForm";

export default function UserSelectPage() {
  const [users, setUsers] = useState([]);
  const { setActiveUser } = useUser();
  const navigate = useNavigate();

  async function loadUsers() {
    const data = await getUsers();
    setUsers(data.users || data);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleSelect(e) {
    const id = e.target.value;
    if (!id) return;

    const user = users.find(u => u.id === Number(id));
    setActiveUser(user);
    navigate("/app");
  }

  async function handleCreateUser(data) {
    const newUser = await createUser(data);
    await loadUsers();
    setActiveUser(newUser);
    navigate("/app");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Välj användare</h1>

      <select onChange={handleSelect} defaultValue="">
        <option value="">-- välj användare --</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>

      <hr style={{ margin: "20px 0" }} />

      <h2>Skapa ny användare</h2>
      <UserForm onSubmit={handleCreateUser} />
    </div>
  );
}