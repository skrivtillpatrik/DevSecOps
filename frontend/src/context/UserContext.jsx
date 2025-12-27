import { createContext, useState, useContext } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [activeUser, setActiveUser] = useState(null);

  function logout() {
    setActiveUser(null);
  }

  return (
    <UserContext.Provider value={{ activeUser, setActiveUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}