import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      if (error?.status === 401) {
        setUser(null);
        return null;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function clearUser() {
    setUser(null);
  }

  useEffect(() => {
    refreshUser().catch(() => {
        setUser(null);
        setLoading(false);
    });
  }, []);

  const value = { user, setUser, loading, refreshUser, clearUser };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
