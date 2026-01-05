import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";

import Layout from "./components/Layout";
import UserSelectPage from "./pages/UserSelectPage";
import MainAppPage from "./pages/MainAppPage";
import CalendarPage from "./pages/CalendarPage";
import NotesPage from "./pages/NotesPage";
import UserAdminPage from "./pages/UserAdminPage";
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

            <Route
              path="/app/calendar"
              element={
                <ProtectedRoute>
                  <CalendarPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/app/notes"
              element={
                <ProtectedRoute>
                  <NotesPage />
                </ProtectedRoute>
              }
            />

            <Route path="/users"
              element={
                <ProtectedRoute>
                  <UserAdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </UserProvider>
  );
}