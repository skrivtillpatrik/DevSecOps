import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const { activeUser, logout } = useUser();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
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

        {activeUser && (
          <div>
            Inloggad som: <strong>{activeUser.name}</strong>
            <button style={{ marginLeft: 10 }} onClick={handleLogout}>
              Logga ut
            </button>
          </div>
        )}
      </header>

      <main>{children}</main>
    </div>
  );
}