import { useNavigate } from "react-router-dom";
import { logout } from "../api";
import { useUser } from "../context/UserContext";

export default function Layout({ children }) {
  const { user, clearUser } = useUser();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
    } finally {
      clearUser();
      navigate("/", { replace: true });
    }
  }

  return (
    <div>
      <header style={{
        background: "#eee",
        padding: "10px 20px",
        marginBottom: 20,
        display: "flex",
        justifyContent: "space-between"
      }}>
        <div>Cowork</div>

        {user ? (
          <div>
            Inloggad som: <strong>{user.name}</strong>
            <button style={{ marginLeft: 10 }} onClick={handleLogout}>
              Logga ut
            </button>
          </div>
        ) :
          (
            <button name="loginbutton" onClick={() => navigate("/login", { replace: true })}>
              Logga in
            </button>
          )}
      </header>

      <main>{children}</main>
    </div>
  );
}