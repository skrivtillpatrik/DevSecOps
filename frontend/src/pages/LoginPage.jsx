import { useState } from "react";
import { login } from "../api";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";





export default function LoginPage() {

    const { refreshUser } = useUser();
    const [authError, setAuthError] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleLogin(username, password) {
        try {
            await login(username, password);
            const currentUser = await refreshUser();

            if (!currentUser) {
                throw new Error("Session was not established.");
            }

            navigate("/app", { replace: true });
        } catch (error) {
            setAuthError(error?.message || "Could not log in.");
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Logga in</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleLogin(username, password);
            }}>
                <input
                    placeholder="Användarnamn"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Lösenord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Logga in</button>
            </form>
            {authError && <p style={{ color: "red" }}>{authError}</p>}
        </div>
    );
}