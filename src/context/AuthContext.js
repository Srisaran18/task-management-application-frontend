import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const setAuth = (nextUser, token) => {
    if (token) localStorage.setItem("token", token);
    if (nextUser) localStorage.setItem("user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, setAuth, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}