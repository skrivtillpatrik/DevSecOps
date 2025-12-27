import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";

import Layout from "./components/Layout";
import UserSelectPage from "./pages/UserSelectPage";
import MainAppPage from "./pages/MainAppPage";

function ProtectedRoute({ children }) {
  const { activeUser } = useUser();
  return activeUser ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<UserSelectPage />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <MainAppPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </UserProvider>
  );
}