import { useEffect, useState } from "react";
import { getUsers, createUser, login } from "../api";
import { useNavigate } from "react-router-dom";
import UserForm from "../components/users/UserForm";
import { useUser } from "../context/UserContext";

export default function UserSelectPage() {
  const [users, setUsers] = useState([]);
  const [authError, setAuthError] = useState("");
  const { refreshUser } = useUser();
  const navigate = useNavigate();

  async function loadUsers() {
    const data = await getUsers();
    setUsers(data.users || data);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleSelect(e) {
    setAuthError("");

    const id = e.target.value;
    if (!id) return;

    const user = users.find(u => u.id === Number(id));
    if (!user) return;

    try {
      await login(user.name, "defaultPassword");
      const currentUser = await refreshUser();

      if (!currentUser) {
        throw new Error("Session was not established.");
      }

      navigate("/app", { replace: true });
    } catch (error) {
      setAuthError(error?.message || "Could not log in.");
    }
  }


  async function handleCreateUser(data) {
    await createUser(data);
    await loadUsers();
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

      {authError && (
        <p style={{ color: "crimson", marginTop: 12 }}>{authError}</p>
      )}

      <hr style={{ margin: "20px 0" }} />

      <h2>Skapa ny användare</h2>
      <UserForm onSubmit={handleCreateUser} />
    </div>
  );
}